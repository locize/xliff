import convert from 'xml-js'
import ElementTypes2 from './inline-elements/ElementTypes2.js'
import { extractValue } from './xml-js/xmlToObject.js'
import { flattenInline } from './inline-elements/flatten.js'

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

  // Accept version 2.0, 2.1, 2.2
  const version = xliffRoot.attributes && xliffRoot.attributes.version
  if (['2.0', '2.1', '2.2'].includes(version)) {
    if (version !== '2.0') {
      result.xliffVersion = version
    }
    const srcLang = xliffRoot.attributes.srcLang
    const trgLang = xliffRoot.attributes.trgLang

    result.sourceLanguage = srcLang
    result.targetLanguage = trgLang
    if (!result.targetLanguage) delete result.targetLanguage

    // Separate known file elements from unknown top-level elements
    const files = []
    const headerExtras = []
    ;(xliffRoot.elements || []).forEach((child) => {
      if (child.type === 'comment') return
      if (child.name === 'file') {
        files.push(child)
      } else {
        headerExtras.push(child)
      }
    })
    if (headerExtras.length) result.headerExtras = headerExtras

    result.resources = files.reduce((resources, file) => {
      let namespace = options.namespace || file.attributes.id
      if (!namespace) namespace = 'default'
      const initValues = { /* source: '', target: '' */ }
      if (!result.targetLanguage) delete initValues.target
      file.elements = file.elements || []
      file.elements = file.elements.filter((child) => child.type !== 'comment')
      resources[namespace] = createUnits(file, initValues, options.inlineAsString)
      return resources
    }, {})
  }

  if (cb) return cb(null, result)
  return result
}

function createUnits (parent, initValues, inlineAsString) {
  if (!parent.elements) return {}
  return parent.elements.reduce((file, unit) => {
    if (!unit.attributes || !unit.attributes.id) return file
    const key = unit.attributes.id
    // Copy all attributes except id
    const additionalAttributes = { ...unit.attributes }
    delete additionalAttributes.id
    // Accept and record ref attribute
    if (unit.attributes.ref) {
      additionalAttributes.ref = unit.attributes.ref
    }
    if (additionalAttributes['slr:sizeRestriction'] !== undefined) {
      additionalAttributes.sizeRestriction = additionalAttributes['slr:sizeRestriction']
      if (typeof additionalAttributes.sizeRestriction === 'string') additionalAttributes.sizeRestriction = parseInt(additionalAttributes.sizeRestriction)
      delete additionalAttributes['slr:sizeRestriction']
    }
    switch (unit.name) {
      case 'unit':
        file[key] = createUnit(unit, initValues, inlineAsString)
        if (Object.keys(additionalAttributes).length) {
          Object.assign(file[key], { additionalAttributes })
        }
        // Restore legacy: do not add additionalElements for ignorable segments
        if (unit.elements) {
          const known = ['segment', 'notes', 'source', 'target', 'note', 'ignorable']
          const additionalElements = unit.elements.filter(e => !known.includes(e.name))
          if (additionalElements.length) {
            file[key].additionalElements = additionalElements
          }
        }
        return file
      case 'group':
        file[key] = { groupUnits: createUnits(unit, initValues, inlineAsString) }
        if (Object.keys(additionalAttributes).length) {
          Object.assign(file[key], { additionalAttributes })
        }
        return file
      default:
        // Preserve unknown elements at unit/group level
        if (!file._additionalElements) file._additionalElements = []
        file._additionalElements.push(unit)
        return file
    }
  }, {})
}

function createUnit (unit, initValues, inlineAsString) {
  // source, target, note
  if (!unit.elements) return undefined
  return unit.elements.reduce((unit, segment) => {
    if (['segment', 'notes'].indexOf(segment.name) < 0) return unit
    segment.elements.forEach((element) => {
      const value = extractValue(element.elements, ElementTypes2)
      switch (element.name) {
        case 'source':
        case 'target':
          unit[element.name] = inlineAsString ? flattenInline(value, ElementTypes2) : value
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
