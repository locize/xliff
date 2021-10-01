import createjsMod from './createjs.js'
import js2xliffMod from './jsToXliff12.js'
const createjs = createjsMod.createjsClb
const jsToXliff12 = js2xliffMod.jsToXliff12Clb

const createxliff12Clb = (srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, cb) => {
  if (!ns || typeof ns !== 'string') {
    cb = ns
    ns = null
  }

  if (!cb) {
    return jsToXliff12(createjs(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns))
  }

  createjs(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, (err, res) => {
    if (err) return cb(err)
    jsToXliff12(res, cb)
  })
}

export default function createxliff12 (srcLng, trgLng, srcKeys, trgKeys, ns, cb, ntKeys) {
  if (!cb && ns === undefined) {
    return new Promise((resolve, reject) => createxliff12Clb(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof ns !== 'function') {
    return new Promise((resolve, reject) => createxliff12Clb(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return createxliff12Clb(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, cb)
}
