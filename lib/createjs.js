const createjsClb = (srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, cb) => {
  const js = {
    sourceLanguage: srcLng,
    targetLanguage: trgLng,
    resources: {}
  }

  if (!cb && (!ns || typeof ns !== 'string')) {
    cb = ns
    ns = null
  }

  trgKeys = trgKeys || {}

  if (ns && typeof ns === 'string') {
    js.resources[ns] = {}

    Object.keys(srcKeys).forEach((srcKey) => {
      js.resources[ns][srcKey] = {
        source: srcKeys[srcKey] || '',
        target: trgKeys[srcKey] || ''
      }

      if (ntKeys && ntKeys[srcKey]) {
        js.resources[ns][srcKey].note = ntKeys[srcKey]
      }
    })

    if (cb) cb(null, js)
    return js
  }

  Object.keys(srcKeys).forEach((ns) => {
    js.resources[ns] = {}

    Object.keys(srcKeys[ns]).forEach((srcKey) => {
      js.resources[ns][srcKey] = {
        source: srcKeys[ns][srcKey] || '',
        target: trgKeys[ns][srcKey] || ''
      }

      if (ntKeys && ntKeys[ns] && ntKeys[ns][srcKey]) {
        js.resources[ns][srcKey].note = ntKeys[ns][srcKey]
      }
    })
  })

  if (cb) cb(null, js)
  return js
}

const createjs = (srcLng, trgLng, srcKeys, trgKeys, ns, cb, ntKeys) => {
  if (!cb && ns === undefined) {
    return new Promise((resolve, reject) => createjsClb(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof ns !== 'function') {
    return new Promise((resolve, reject) => createjsClb(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return createjsClb(srcLng, trgLng, srcKeys, trgKeys, ntKeys, ns, cb)
}

createjs.createjsClb = createjsClb

export default createjs
