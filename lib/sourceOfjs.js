import ofjs from './ofjs.js'

export default function sourceOfjs (js, cb) {
  return ofjs(js, 'source', cb)
}
