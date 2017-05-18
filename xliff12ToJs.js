const xml2js = require('xml2js');
const parser = new xml2js.Parser();

function xliff12ToJs(str, cb) {
  if (typeof str !== 'string') {
    return cb(new Error('The first parameter was not a string'));
  }

  const result = {
    resources: {}
  };

  const extractValue = (value) => {
    return typeof value !== 'string' ? value['_'] : value;
  };

  parser.parseString(str, (err, data) => {
    if (err) return cb(err);

    const srcLang = data.xliff.file[0].$['source-language'];
    const trgLang = data.xliff.file[0].$['target-language'];

    result.sourceLanguage = srcLang;
    result.targetLanguage = trgLang;

    data.xliff.file.forEach((f) => {
      const namespace = f.$.original;
      result.resources[namespace] = {};

      const entries = f.body[0]['trans-unit'];
      entries.forEach((entry) => {
        const key = entry.$.id;
        result.resources[namespace][key] = {
          source: '',
          target: ''
        };

        if (entry.source) {
          result.resources[namespace][key].source = extractValue(entry.source[0]);
        }

        if (entry.target) {
          result.resources[namespace][key].target = extractValue(entry.target[0]);
        }
        if (entry.note) {
          result.resources[namespace][key].note = extractValue(entry.note[0]);
        }
      });
    });

    cb(null, result);
  });
}

module.exports = xliff12ToJs;
