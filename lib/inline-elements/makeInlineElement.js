/**
 * Helper to construct an object representing an XLIFF inline element (an XML element within a `source` or `target` value).
 * @param type The inline element type. This should be one of the constants defined in ElementTypes.js
 * @param attributes (optional) An object with property/value pairs that correspond to the attributes to add to the element.
 * @param contents (optional) A string or Array containing the contents to be inserted between the opening and closing tags
 *                 (if the element is a type that supports contents).
 * @return An object in the proper structure to represent the XLIFF inline element as supported by this library
 */
export default function makeInlineElement (type, attributes, contents) {
  const contentsObj = contents !== undefined ? { contents } : {}
  const dataObj = Object.assign({}, attributes, contentsObj)
  return { [type]: dataObj }
}
