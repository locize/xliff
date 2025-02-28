/**
 * Converts an element type to its corresponding XML tag name
 * @param {string} type - The element type to convert
 * @param {Object} types - Object containing element type mapping information
 * @param {Object} types.elementTypeToTagMap - Map of element types to XML tag names
 * @returns {string} The corresponding XML tag name
 */
export function elementTypeToTag (type, types) {
  return types.elementTypeToTagMap[type]
}

/**
 * Converts an XML tag name to its corresponding element type
 * @param {string} tagName - The XML tag name to convert
 * @param {Object} types - Object containing element type mapping information
 * @param {Object} types.tagToElementTypeMap - Map of XML tag names to element types
 * @returns {string} The corresponding element type
 */
export function tagToElementType (tagName, types) {
  return types.tagToElementTypeMap[tagName]
}
