import ofjs from './ofjs.js'

export default function targetOfjs (js, options = { includeGroups: false }, cb) {
  return ofjs(js, 'target', options, cb)
}
