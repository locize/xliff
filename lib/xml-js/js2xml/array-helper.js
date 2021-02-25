// copied from: https://github.com/nashwaan/xml-js/blob/master/lib/array-helper.js

export function isArray (value) {
  if (Array.isArray) {
    return Array.isArray(value)
  }
  // fallback for older browsers like  IE 8
  return Object.prototype.toString.call(value) === '[object Array]'
}
