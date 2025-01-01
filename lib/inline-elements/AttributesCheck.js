import isHexCode from '../util/isHexCode.js'
import ElementTypes from './ElementTypes.js'

export default {
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
}
