const createjsClb = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  const js = {
    sourceLanguage: srcLng,
    targetLanguage: trgLng,
    resources: {}
  }

  if (!cb && (!ns || typeof ns !== 'string')) {
    cb = ns
    ns = null
  }

  if (ns && typeof ns === 'string') {
    js.resources[ns] = {}

    Object.keys(trgKeys).forEach((srcKey) => {
      js.resources[ns][srcKey] = {
        source: srcKeys[srcKey] || '',
        target: trgKeys[srcKey] || ''
      }
    })

    if (cb) cb(null, js)
    return js
  }

  Object.keys(trgKeys).forEach((ns) => {
    js.resources[ns] = {}

    Object.keys(trgKeys[ns]).forEach((srcKey) => {
      js.resources[ns][srcKey] = {
        source: srcKeys[ns][srcKey] || '',
        target: trgKeys[ns][srcKey] || ''
      }
    })
  })

  if (cb) cb(null, js)
  return js
}

const createjs = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  if (!cb && ns === undefined) {
    return new Promise((resolve, reject) => createjsClb(srcLng, trgLng, srcKeys, trgKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof ns !== 'function') {
    return new Promise((resolve, reject) => createjsClb(srcLng, trgLng, srcKeys, trgKeys, ns, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return createjsClb(srcLng, trgLng, srcKeys, trgKeys, ns, cb)
}

createjs.createjsClb = createjsClb

export default createjs
