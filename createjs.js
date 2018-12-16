module.exports = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  const js = {
    sourceLanguage: srcLng,
    targetLanguage: trgLng,
    resources: {}
  };

  if (ns && typeof ns === 'string') {
    js.resources[ns] = {};

    Object.keys(trgKeys).forEach((srcKey) => {
      js.resources[ns][srcKey] = {
        source: srcKeys[srcKey] || '',
        target: trgKeys[srcKey] || ''
      };
    });

    if (cb) cb(null, js);
    return js;
  }


  if (ns) {
    cb = ns;
    ns = null;
  }

  Object.keys(trgKeys).forEach((ns) => {
    js.resources[ns] = {};

    Object.keys(trgKeys[ns]).forEach((srcKey) => {
      js.resources[ns][srcKey] = {
        source: srcKeys[ns][srcKey] || '',
        target: trgKeys[ns][srcKey] || ''
      };
    });
  });

  if (cb) cb(null, js);
  return js;
};
