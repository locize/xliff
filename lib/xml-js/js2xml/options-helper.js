// copied from: https://github.com/nashwaan/xml-js/blob/master/lib/options-helper.js

import { isArray } from './array-helper.js'

export function copyOptions (options) {
  let key
  const copy = {}
  for (key in options) {
    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty(key)) {
      copy[key] = options[key]
    }
  }
  return copy
}

export function ensureFlagExists (item, options) {
  if (!(item in options) || typeof options[item] !== 'boolean') {
    options[item] = false
  }
}

export function ensureSpacesExists (options) {
  if (!('spaces' in options) || (typeof options.spaces !== 'number' && typeof options.spaces !== 'string')) {
    options.spaces = 0
  }
}

export function ensureAlwaysArrayExists (options) {
  if (!('alwaysArray' in options) || (typeof options.alwaysArray !== 'boolean' && !isArray(options.alwaysArray))) {
    options.alwaysArray = false
  }
}

export function ensureKeyExists (key, options) {
  if (!(key + 'Key' in options) || typeof options[key + 'Key'] !== 'string') {
    options[key + 'Key'] = options.compact ? '_' + key : key
  }
}

export function checkFnExists (key, options) {
  return key + 'Fn' in options
}
