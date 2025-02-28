import { tagToElementType } from '../inline-elements/typeToTagMaps.js'
import Types2 from '../inline-elements/ElementTypes2.js'
/**
 * Extracts and processes value from XML elements
 * @param {{type: 'text' | 'element' | 'cdata' | string | undefined}|Array|string|null|undefined} valueElements - The XML element(s) to extract value from
 * @param {Object} elementTypeInfo - Configuration object containing element type information
 * @param {Types2.factories} elementTypeInfo.factories - Map of element type factories
 * @returns {string|Array<string>} The extracted value(s)
 */
export function extractValue (valueElements, elementTypeInfo) {
  if (valueElements === undefined || valueElements === null || valueElements === '') {
    return ''
  }

  if (Array.isArray(valueElements) && valueElements.length > 1) {
    return valueElements.map((valueElement) => extractValue(valueElement, elementTypeInfo))
  }

  const valueElement = Array.isArray(valueElements) ? valueElements[0] || '' : valueElements

  // text node
  if (valueElement.type === 'text') {
    if (/\n\s*$/.test(valueElement.text)) {
      return valueElement.text.substr(0, valueElement.text.lastIndexOf('\n'))
    }
    return valueElement.text
  }

  // nested inline element tag
  const elementType = tagToElementType(valueElement.name, elementTypeInfo)
  if (valueElement.type === 'element' && elementType !== undefined) {
    const inlineElementFactory = elementTypeInfo.factories[elementType]
    return inlineElementFactory(
      valueElement.attributes,
      extractValue(valueElement.elements, elementTypeInfo)
    )
  }

  // CDATA Section https://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2-cd02.html
  if (valueElement.type === 'cdata') {
    return valueElement.cdata
  }

  // just ignore anything else
  return ''
}
