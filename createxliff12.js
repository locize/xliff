const createjs = require('./createjs');
const jsToXliff12 = require('./jsToXliff12');

module.exports = (srcLng, trgLng, srcKeys, trgKeys, ns, cb) => {
  if (!ns || typeof ns !== 'string') {
    cb = ns;
    ns = null;
  }

  createjs(srcLng, trgLng, srcKeys, trgKeys, ns, (err, res) => {
    if (err) return cb(err);
    jsToXliff12(res, cb);
  });
};
