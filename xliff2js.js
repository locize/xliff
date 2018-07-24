const convert = require('xml-js');
const ElementTypes2 = require('./inline-elements/ElementTypes2');
const extractValue = require('./xml-js/xmlToObject').extractValue;

function xliffToJs(str, cb) {
  if (typeof str !== 'string') {
    return cb(new Error('The first parameter was not a string'));
  }

  const result = {};

  var xmlObj;
  try {
    xmlObj = convert.xml2js(str, {});
  } catch (err) {
    return cb(err);
  }

  const xliffRoot = xmlObj.elements[0];

  const srcLang = xliffRoot.attributes['srcLang'];
  const trgLang = xliffRoot.attributes['trgLang'];

  result.sourceLanguage = srcLang;
  result.targetLanguage = trgLang;

  result.resources = xliffRoot.elements.reduce((resources, file) => {
    const namespace = file.attributes.id;

    // namespace
    resources[namespace] = file.elements.reduce((file, unit) => {
      const key = unit.attributes.id;

      // source, target, note
      file[key] = unit.elements.reduce((unit, segment) => {
        segment.elements.forEach((element) => {
          switch (element.name) {
            case 'source':
            case 'target':
            case 'note':
              unit[element.name] = extractValue(element.elements, ElementTypes2);
              break;
          }
        });

        return unit;
      }, { source: '', target: '' });

      return file;
    }, {});

    return resources;
  }, {});

  cb(null, result);
}

module.exports = xliffToJs;
