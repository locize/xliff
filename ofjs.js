module.exports = (js, what, cb) => {
  const res = {};

  const nsKeys = Object.keys(js.resources || {});
  if (nsKeys.length === 1) {
    const ns = js.resources[nsKeys[0]];
    const keys = Object.keys(ns);
    keys.forEach((key) => {
      res[key] = ns[key][what];
    });
    if (cb) cb(null, res);
    return res;
  }

  nsKeys.forEach((nsKey) => {
    res[nsKey] = {};

    const ns = js.resources[nsKey];
    const keys = Object.keys(ns);
    keys.forEach((key) => {
      res[nsKey][key] = ns[key][what];
    });
  });
  if (cb) cb(null, res);
  return res;
};
