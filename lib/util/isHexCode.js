/**
 *
 * @param {string} str
 * @returns
*/
export default function (str) {
  if (!str.match(/^[0-9A-Fa-f]+$/)) return false
  return true
}
