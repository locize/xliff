import convert from 'xml-js'
import ElementTypes2 from './inline-elements/ElementTypes2.js'
import { extractValue } from './xml-js/xmlToObject.js'

const xliffToJsClb = (str, options, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  options = options || {}
  if (typeof str !== 'string') {
    const err = new Error('The first parameter was not a string')
    if (cb) return cb(err)
    return err
  }

  const result = {}

  let xmlObj
  try {
    xmlObj = convert.xml2js(str, {})
  } catch (err) {
    if (cb) return cb(err)
    return err
  }

  const xliffRoot = xmlObj.elements.find((ele) => ele.name === 'xliff')

  if (xliffRoot.attributes) {
    const srcLang = xliffRoot.attributes.srcLang
    const trgLang = xliffRoot.attributes.trgLang

    result.sourceLanguage = srcLang
    result.targetLanguage = trgLang
    if (!result.targetLanguage) delete result.targetLanguage

    xliffRoot.elements = xliffRoot.elements.filter((child) => child.type !== 'comment')
    result.resources = xliffRoot.elements.reduce((resources, file) => {
      const namespace = options.namespace || file.attributes.id

      const initValues = { source: '', target: '' }
      if (!result.targetLanguage) delete initValues.target

      // namespace
      file.elements = file.elements || []
      file.elements = file.elements.filter(
        (child) => child.type !== 'comment'
      )
      resources[namespace] = createUnits(file, initValues)

      return resources
    }, {})
  }

  if (cb) return cb(null, result)
  return result
}

function createUnits (parent, initValues) {
  return parent.elements.reduce((file, unit) => {
    const key = unit.attributes.id
    const additionalAttributes = unit.attributes
    delete additionalAttributes.id

    switch (unit.name) {
      case 'unit':
        file[key] = createUnit(unit, initValues)
        if (Object.keys(additionalAttributes).length) {
          Object.assign(file[key], { additionalAttributes })
        }
        return file

      case 'group':
        file[key] = { groupUnits: createUnits(unit, initValues) }
        if (Object.keys(additionalAttributes).length) {
          Object.assign(file[key], { additionalAttributes })
        }
        return file

      default:
        return file
    }
  }, {})
}

function createUnit (unit, initValues) {
  // source, target, note
  return unit.elements.reduce((unit, segment) => {
    if (['segment', 'notes'].indexOf(segment.name) < 0) return unit
    segment.elements.forEach((element) => {
      const value = extractValue(element.elements, ElementTypes2)
      switch (element.name) {
        case 'source':
        case 'target':
          unit[element.name] = value
          break
        case 'note':
          if (unit[element.name]) {
            if (!Array.isArray(unit[element.name])) {
              unit[element.name] = [ unit[element.name] ]
            }
            unit[element.name].push(value)
          } else {
            unit[element.name] = value
          }
          break
      }
    })
    return unit
  }, JSON.parse(JSON.stringify(initValues)))
}

export default function xliffToJs (str, options, cb) {
  if (!cb && options === undefined) {
    return new Promise((resolve, reject) => xliffToJsClb(str, options, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof options !== 'function') {
    return new Promise((resolve, reject) => xliffToJsClb(str, options, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  xliffToJsClb(str, options, cb)
}
