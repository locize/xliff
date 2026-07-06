import convert from 'xml-js'
import ElementTypes12 from './inline-elements/ElementTypes12.js'
import { extractValue } from './xml-js/xmlToObject.js'
import { flattenInline } from './inline-elements/flatten.js'

const xliff12ToJsClb = (str, options, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  options = options || { captureSpacesBetweenElements: false }
  if (typeof str !== 'string') {
    const err = new Error('The first parameter was not a string')
    if (cb) return cb(err)
    return err
  }

  const result = {}

  let xmlObj
  try {
    xmlObj = convert.xml2js(str, options)
  } catch (err) {
    if (cb) return cb(err)
    return err
  }

  const xliffRoot = xmlObj.elements.find((ele) => ele.name === 'xliff')

  // Accept version 1.2, 2.0, 2.1, 2.2
  const version = xliffRoot.attributes && xliffRoot.attributes.version
  if (version && version !== '1.2') {
    result.xliffVersion = version
  }
  if (xliffRoot.elements && xliffRoot.elements.length) {
    const elements = xliffRoot.elements.filter((e) => e.type === 'element')
    const srcLang = elements[0].attributes['source-language'] || xliffRoot.attributes.srcLang
    const trgLang = elements[0].attributes['target-language'] || xliffRoot.attributes.trgLang

    result.sourceLanguage = srcLang
    result.targetLanguage = trgLang
    if (!result.targetLanguage) delete result.targetLanguage

    // Separate known file elements from unknown top-level elements
    const files = []
    const headerExtras = []
    elements.forEach((child) => {
      if (child.name === 'file') {
        files.push(child)
      } else {
        headerExtras.push(child)
      }
    })
    if (headerExtras.length) result.headerExtras = headerExtras

    result.resources = files.reduce((resources, file) => {
      const namespace = options.namespace || file.attributes.original
      const body = file.elements.filter((e) => e.type === 'element').find((e) => e.name === 'body')
      body.elements = body.elements || []
      const bodyChildren = body.elements.filter(
        (child) => child.type !== 'comment' && child.type === 'element'
      )
      resources[namespace] = createUnits(bodyChildren, options.inlineAsString)
      return resources
    }, {})
  } else {
    result.resources = {}
  }

  if (cb) return cb(null, result)
  return result
}

function createUnits (childElements, inlineAsString) {
  return childElements.reduce((parent, child) => {
    if (!child.attributes || !child.attributes.id) return parent
    const key = child.attributes.id
    if (!child.elements) return parent
    const children = child.elements.filter((e) => e.name === 'trans-unit' || e.name === 'group')
    if (children.length) {
      parent[key] = createGroupTag(child, children, inlineAsString)
    } else {
      parent[key] = createTransUnitTag(child, inlineAsString)
    }
    // Accept and record ref attribute
    if (child.attributes.ref) {
      if (!parent[key].additionalAttributes) parent[key].additionalAttributes = {}
      parent[key].additionalAttributes.ref = child.attributes.ref
    }
    // Preserve unknown child elements in additionalElements
    const known = ['trans-unit', 'group', 'source', 'target', 'note', 'body']
    const additionalElements = child.elements.filter(e => !known.includes(e.name))
    if (additionalElements.length) {
      parent[key].additionalElements = additionalElements
    }
    return parent
  }, {})
}

function createTransUnitTag (transUnit, inlineAsString) {
  const jsUnit = transUnit.elements.reduce((unit, element) => {
    const value = extractValue(element.elements, ElementTypes12)
    switch (element.name) {
      case 'source':
      case 'target':
        unit[element.name] = inlineAsString ? flattenInline(value, ElementTypes12) : value
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

    return unit
  }, { /* source: '' */ })

  return addAdditionalAttributes(jsUnit, transUnit.attributes)
}

function createGroupTag (groupUnit, children, inlineAsString) {
  const jsGroupUnit = {
    groupUnits: createUnits(children, inlineAsString)
  }

  return addAdditionalAttributes(jsGroupUnit, groupUnit.attributes)
}

function addAdditionalAttributes (jsUnit, attributes) {
  const additionalAttributes = attributes
  delete additionalAttributes.id

  if (Object.keys(additionalAttributes).length) {
    Object.assign(jsUnit, { additionalAttributes })
  }

  return jsUnit
}

export default function xliff12ToJs (str, options, cb) {
  if (!cb && options === undefined) {
    return new Promise((resolve, reject) => xliff12ToJsClb(str, options, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof options !== 'function') {
    return new Promise((resolve, reject) => xliff12ToJsClb(str, options, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  xliff12ToJsClb(str, options, cb)
}
