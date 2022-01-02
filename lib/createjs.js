function setSegment (category, srcObj, trgObj, ntObj, key) {
  const srcValue = srcObj[key] || ''
  const trgValue = trgObj[key] || ''

  if (typeof srcValue === 'object' && typeof trgValue === 'object') {
    category[key] = { groupUnits: {} }
    const grpObj = category[key].groupUnits

    Object.keys(srcValue).forEach(grpKey => {
      setSegment(grpObj, srcObj[key], trgObj[key], ntObj[key], grpKey)

      if (ntObj && ntObj[key] && ntObj[key][grpKey]) {
        category[key].note = ntObj[key][grpKey]
      }
    })
  } else {
    category[key] = { source: srcValue, target: trgValue }

    if (ntObj && ntObj[key]) {
      category[key].note = ntObj[key]
    }
  }
}

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
    const nsObj = js.resources[ns]

    Object.keys(srcKeys).forEach((srcKey) => {
      setSegment(nsObj, srcKeys, trgKeys, ntKeys, srcKey)
    })

    if (cb) cb(null, js)
    return js
  }

  Object.keys(srcKeys).forEach((ns) => {
    js.resources[ns] = {}

    Object.keys(srcKeys[ns]).forEach((srcKey) => {
      setSegment(js.resources[ns], srcKeys[ns], trgKeys[ns], ntKeys && ntKeys[ns], srcKey)
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
