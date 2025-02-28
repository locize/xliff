import ElementTypes from "./ElementTypes"
/**
 * Creates an object representing an XLIFF inline element (an XML element within a `source` or `target` value).
 * 
 * @param {keyof ElementTypes} type - The inline element type from ElementTypes (e.g., 'Standalone', 'GenericSpan')
 * @param {Object} [attributes] - Element attributes as key-value pairs
 * @param {*} [contents] - Element contents, which can be:
 *   - string: For text content
 *   - Array: For nested inline elements
 *   - undefined: For empty elements
 * 
 * @returns {Object} An object with structure:
 *   {
 *     [type]: {
 *       ...attributes,
 *       contents?: string|Array
 *     }
 *   }
 * 
 * @example
 * // Create a CodePoint element
 * makeInlineElement('CodePoint', { hex: '0041' })
 * // Returns: { CodePoint: { hex: '0041' } }
 * 
 * @example
 * // Create a Span with content
 * makeInlineElement('Span', { id: 'bold1' }, ['Hello'])
 * // Returns: { Span: { id: 'bold1', contents: ['Hello'] } }
 */
export default function makeInlineElement (type, attributes, contents) {
  const contentsObj = contents !== undefined ? { contents } : {}
  const dataObj = Object.assign({}, attributes, contentsObj)
  return { [type]: dataObj }
}
