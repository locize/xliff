import ofjs from './ofjs.js'

export default function sourceOfjs (js, options = { includeGroups: false }, cb) {
  return ofjs(js, 'source', options, cb)
}
