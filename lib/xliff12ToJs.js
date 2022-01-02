import convert from 'xml-js'
import ElementTypes12 from './inline-elements/ElementTypes12.js'
import { extractValue } from './xml-js/xmlToObject.js'

const xliff12ToJsClb = (str, options, cb) => {
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

  const srcLang = xliffRoot.elements[0].attributes['source-language']
  const trgLang = xliffRoot.elements[0].attributes['target-language']

  result.sourceLanguage = srcLang
  result.targetLanguage = trgLang
  if (!result.targetLanguage) delete result.targetLanguage

  result.resources = xliffRoot.elements.reduce((resources, file) => {
    const namespace = options.namespace || file.attributes.original

    const body = file.elements.find((e) => e.name === 'body')
    body.elements = body.elements || []
    const bodyChildren = body.elements.filter(
      (child) => child.type !== 'comment'
    )

    // namespace
    resources[namespace] = createUnits(bodyChildren)

    return resources
  }, {})

  if (cb) return cb(null, result)
  return result
}

function createUnits (childElements) {
  return childElements.reduce((parent, child) => {
    const key = child.attributes.id
    const children = child.elements.filter((e) => e.name === 'trans-unit' || e.name === 'group')
    if (children.length) {
      parent[key] = createGroupTag(child, children)
    } else {
      parent[key] = createTransUnitTag(child)
    }

    return parent
  }, {})
}

function createTransUnitTag (transUnit) {
  const jsUnit = transUnit.elements.reduce((unit, element) => {
    const value = extractValue(element.elements, ElementTypes12)
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

    return unit
  }, { source: '' })

  return addAdditionalAttributes(jsUnit, transUnit.attributes)
}

function createGroupTag (groupUnit, children) {
  const jsGroupUnit = {
    groupUnits: createUnits(children)
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
