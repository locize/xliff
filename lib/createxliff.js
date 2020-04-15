import { createjsClb as createjs } from './createjs.js'
import { js2xliffClb as js2xliff } from './js2xliff.js'

const createxliffClb = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  if (!ns || typeof ns !== 'string') {
    cb = ns
    ns = null
  }

  if (!cb) {
    return js2xliff(createjs(srcLng, trgLng, srcKeys, trgKeys, ns))
  }

  createjs(srcLng, trgLng, srcKeys, trgKeys, ns, (err, res) => {
    if (err) return cb(err)
    js2xliff(res, cb)
  })
}

export default function createxliff (srcLng, trgLng, srcKeys, trgKeys, ns, cb) {
  if (!cb && ns === undefined) {
    return new Promise((resolve, reject) => createxliffClb(srcLng, trgLng, srcKeys, trgKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof ns !== 'function') {
    return new Promise((resolve, reject) => createxliffClb(srcLng, trgLng, srcKeys, trgKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return createxliffClb(srcLng, trgLng, srcKeys, trgKeys, ns, cb)
}
