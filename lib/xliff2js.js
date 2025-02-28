import convert from 'xml-js'
import ElementTypes2 from './inline-elements/ElementTypes2.js'
import { extractValue } from './xml-js/xmlToObject.js'

/**
 * Converts XLIFF string to JavaScript object (callback version)
 * @param {string} str - XLIFF string to convert
 * @param {Object} [options] - Conversion options
 * @param {string} [options.namespace] - Custom namespace for resources
 * @param {Function} [cb] - Callback function
 * @returns {Error|Object} Returns Error object if conversion fails, or result object if successful
 */
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
    try {
      const srcLang = xliffRoot.attributes.srcLang
      const trgLang = xliffRoot.attributes.trgLang

      result.sourceLanguage = srcLang
      result.targetLanguage = trgLang
      if (!result.targetLanguage) delete result.targetLanguage

      xliffRoot.elements = xliffRoot.elements.filter((child) => child.type !== 'comment')
      result.resources = xliffRoot.elements.reduce((resources, file) => {
        const namespace = options.namespace || file.attributes.id

        const initValues = { /* source: '', target: '' */ }
        if (!result.targetLanguage) delete initValues.target

        // namespace
        file.elements = file.elements || []
        file.elements = file.elements.filter(
          (child) => child.type !== 'comment'
        )
        resources[namespace] = createUnits(file, initValues)

        return resources
      }, {})
    } catch (error) {
      if (cb) return cb(error, result)
    }
  }

  if (cb) return cb(null, result)
  return result
}

/**
 * Creates translation units from XLIFF file element
 * @param {Object} parent - Parent element containing units
 * @param {Object} initValues - Initial values for units
 * @returns {Object} Object containing translation units
 */
function createUnits (parent, initValues) {
  if (!parent.elements) return {}
  return parent.elements.reduce((file, unit) => {
    const key = unit.attributes.id
    const additionalAttributes = unit.attributes
    delete additionalAttributes.id

    if (additionalAttributes['slr:sizeRestriction'] !== undefined) {
      additionalAttributes.sizeRestriction = additionalAttributes['slr:sizeRestriction']
      if (typeof additionalAttributes.sizeRestriction === 'string') additionalAttributes.sizeRestriction = parseInt(additionalAttributes.sizeRestriction)
      delete additionalAttributes['slr:sizeRestriction']
    }

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

/**
 * Creates a single translation unit from XLIFF unit element
 * @param {Object} unit - XLIFF unit element
 * @param {Object} initValues - Initial values for the unit
 * @param {string} [initValues.source] - Initial source text
 * @param {string} [initValues.target] - Initial target text
 * @returns {Object|undefined} Translation unit object or undefined if no elements
 */
function createUnit (unit, initValues) {
  // source, target, note
  if (!unit.elements) return undefined
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

/**
 * Converts XLIFF string to JavaScript object with Promise support
 * @param {string} str - XLIFF string to convert
 * @param {Object} [options] - Conversion options
 * @param {string} [options.namespace] - Custom namespace for resources
 * @param {Function} [cb] - Optional callback function
 * @returns {Promise<Object>|void} Returns Promise if no callback provided, otherwise void
 */
export default function xliffToJs (str, options, cb) {
  if (!cb && options === undefined) {
    return new Promise((resolve, reject) => xliffToJsClb(str, options, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof options !== 'function') {
    return new Promise((resolve, reject) => xliffToJsClb(str, options, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  xliffToJsClb(str, options, cb)
}
