const createjs = require('./createjs');
const js2xliff = require('./js2xliff');

module.exports = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  if (!ns || typeof ns !== 'string') {
    cb = ns;
    ns = null;
  }

  createjs(srcLng, trgLng, srcKeys, trgKeys, ns, (err, res) => {
    if (err) return cb(err);
    js2xliff(res, cb);
  });
};
