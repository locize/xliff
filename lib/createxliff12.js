import { createjsClb as createjs } from './createjs.js'
import { jsToXliff12Clb as jsToXliff12 } from './jsToXliff12.js'

const createxliff12Clb = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  if (!ns || typeof ns !== 'string') {
    cb = ns
    ns = null
  }

  if (!cb) {
    return jsToXliff12(createjs(srcLng, trgLng, srcKeys, trgKeys, ns))
  }

  createjs(srcLng, trgLng, srcKeys, trgKeys, ns, (err, res) => {
    if (err) return cb(err)
    jsToXliff12(res, cb)
  })
}

export default function createxliff12 (srcLng, trgLng, srcKeys, trgKeys, ns, cb) {
  if (!cb && ns === undefined) {
    return new Promise((resolve, reject) => createxliff12Clb(srcLng, trgLng, srcKeys, trgKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof ns !== 'function') {
    return new Promise((resolve, reject) => createxliff12Clb(srcLng, trgLng, srcKeys, trgKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return createxliff12Clb(srcLng, trgLng, srcKeys, trgKeys, ns, cb)
}
