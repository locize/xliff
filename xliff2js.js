const convert = require('xml-js');
const ElementTypes2 = require('./inline-elements/ElementTypes2');
const extractValue = require('./xml-js/xmlToObject').extractValue;

function xliffToJs(str, cb) {
  if (typeof str !== 'string') {
    const err = new Error('The first parameter was not a string');
    if (cb) return cb(err);
    return err;
  }

  const result = {};

  var xmlObj;
  try {
    xmlObj = convert.xml2js(str, {});
  } catch (err) {
    if (cb) return cb(err);
    return err;
  }

  const xliffRoot = xmlObj.elements.find((ele) => ele.name === 'xliff');

  if (xliffRoot.attributes) {
    const srcLang = xliffRoot.attributes['srcLang'];
    const trgLang = xliffRoot.attributes['trgLang'];

    result.sourceLanguage = srcLang;
    result.targetLanguage = trgLang;

    result.resources = xliffRoot.elements.reduce((resources, file) => {
      const namespace = file.attributes.id;

      // namespace
      resources[namespace] = file.elements.reduce((file, unit) => {
        if (unit.name !== 'unit') return file;

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
        const additionalAttributes = unit.attributes;
        delete additionalAttributes.id;
        if (Object.keys(additionalAttributes).length) {
          Object.assign(file[key], {additionalAttributes});
        }

        return file;
      }, {});

      return resources;
    }, {});
  }

  if (cb) return cb(null, result);
  return result;
}

module.exports = xliffToJs;
