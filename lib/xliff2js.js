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

  var xmlObj
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

    result.resources = xliffRoot.elements.reduce((resources, file) => {
      const namespace = options.namespace || file.attributes.id

      const initValues = { source: '', target: '' }
      if (!result.targetLanguage) delete initValues.target

      // namespace
      file.elements = file.elements || []
      resources[namespace] = file.elements.reduce((file, unit) => {
        if (unit.name !== 'unit') return file

        const key = unit.attributes.id

        // source, target, note
        file[key] = unit.elements.reduce((unit, segment) => {
          segment.elements.forEach((element) => {
            switch (element.name) {
              case 'source':
              case 'target':
              case 'note':
                unit[element.name] = extractValue(element.elements, ElementTypes2)
                break
            }
          })

          return unit
        }, JSON.parse(JSON.stringify(initValues)))
        const additionalAttributes = unit.attributes
        delete additionalAttributes.id
        if (Object.keys(additionalAttributes).length) {
          Object.assign(file[key], { additionalAttributes })
        }

        return file
      }, {})

      return resources
    }, {})
  }

  if (cb) return cb(null, result)
  return result
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
