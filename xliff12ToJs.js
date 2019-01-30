const convert = require('xml-js');
const ElementTypes12 = require('./inline-elements/ElementTypes12');
const extractValue = require('./xml-js/xmlToObject').extractValue;

function xliff12ToJs(str, cb) {
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

  const srcLang = xliffRoot.elements[0].attributes['source-language'];
  const trgLang = xliffRoot.elements[0].attributes['target-language'];

  result.sourceLanguage = srcLang;
  result.targetLanguage = trgLang;

  result.resources = xliffRoot.elements.reduce((resources, file) => {
    const namespace = file.attributes.original;

    const body = file.elements.find((e) => e.name === 'body');
    const transUnits = body.elements;

    // namespace
    resources[namespace] = transUnits.reduce((file, transUnit) => {
      const key = transUnit.attributes.id;

      // source, target, note
      file[key] = transUnit.elements.reduce((unit, element) => {
        switch (element.name) {
          case 'source':
          case 'target':
          case 'note':
            unit[element.name] = extractValue(element.elements, ElementTypes12);
            break;
        }

        return unit;
      }, { source: '' });
      const additionalAttributes = transUnit.attributes;
      delete additionalAttributes.id;
      if (Object.keys(additionalAttributes).length) {
        Object.assign(file[key], {additionalAttributes});
      }

      return file;
    }, {});

    return resources;
  }, {});

  if (cb) return cb(null, result);
  return result;
}

module.exports = xliff12ToJs;
