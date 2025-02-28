/**
 * Map of special characters to their XML entity equivalents
 * @type {Object.<string, string>}
 * @private
 */
const map = {
  '&': '&amp;', // this must be the first !!!
  '"': '&quot;',
  '\'': '&apos;',
  '<': '&lt;',
  '>': '&gt;'
}

/**
 * Escapes special characters in a string for XML
 * @param {string} str - The string to escape
 * @returns {string} The escaped string with XML entities
 */
export default function (str) {
  Object.keys(map).forEach(function (char) {
    str = str.replace(new RegExp(char, 'g'), map[char])
  })
  return str
};
