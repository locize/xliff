import isHexCode from '../util/isHexCode.js'
import ElementTypes from './ElementTypes.js'

export default Object.freeze({
  /**
   * Validates attributes for CodePoint elements
   * @param {Object} attributes - The element's attributes
   * @param {string} [attributes.hex] - Hexadecimal code point value (e.g., "0041" for 'A')
   * @param {Array} contents - The element's contents (must be empty)
   * @throws {Error} If element has contents
   * @throws {Error} If hex attribute is missing
   * @throws {Error} If hex value is invalid
   */
  [ElementTypes.CodePoint]: (attributes, contents) => {
    if (contents.length !== 0) {
      throw new Error('<cp> element should be empty')
    }
    if (!(attributes?.hex)) {
      throw new Error('Hex is a required attribute for <cp> element')
    }
    if (attributes && !isHexCode(attributes?.hex)) {
      throw new Error('Hex should be a valid hexadecimal value')
    }
  }
})
