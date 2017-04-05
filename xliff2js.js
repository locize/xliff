const xml2js = require('xml2js');
const parser = new xml2js.Parser();

function xliffToJs(str, cb) {
  if (typeof str !== 'string') {
    return cb(new Error('The first parameter was not a string'));
  }

  const result = {
    resources: {}
  };

  parser.parseString(str, (err, data) => {
    if (err) return cb(err);

    const srcLang = data.xliff.$.srcLang;
    const trgLang = data.xliff.$.trgLang;

    result.sourceLanguage = srcLang;
    result.targetLanguage = trgLang;

    data.xliff.file.forEach((f) => {
      const namespace = f.$.id;
      result.resources[namespace] = {};

      const entries = f.unit;
      entries.forEach((entry) => {
        const key = entry.$.id;
        result.resources[namespace][key] = {
          source: '',
          target: ''
        };
        entry.segment.forEach((seg) => {
          if (seg.source) {
            const srcValue = seg.source[0];
            result.resources[namespace][key].source = srcValue;
          }
          if (seg.target) {
            const trgValue = seg.target[0];
            result.resources[namespace][key].target = trgValue;
          }
          if (seg.note) {
            const noteValue = seg.note[0];
            result.resources[namespace][key].note = noteValue;
          }
        });
      });
    });

    cb(null, result);
  });
}

module.exports = xliffToJs;
