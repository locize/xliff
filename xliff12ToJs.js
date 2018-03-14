const convert = require('xml-js');

function xliff12ToJs(str, cb) {
  if (typeof str !== 'string') {
    return cb(new Error('The first parameter was not a string'));
  }

  const result = {};

  const extractValue = (valueElement) => {
    return valueElement.type !== 'text' ? extractValue(valueElement.elements[0]) : valueElement.text;
  };

  var xmlObj;
  try {
    xmlObj = convert.xml2js(str, {});
  } catch (err) {
    return cb(err);
  }

  const xliffRoot = xmlObj.elements[0];

  const srcLang = xliffRoot.elements[0].attributes['source-language'];
  const trgLang = xliffRoot.elements[0].attributes['target-language'];

  result.sourceLanguage = srcLang;
  result.targetLanguage = trgLang;

  result.resources = xliffRoot.elements.reduce((resources, file) => {
    const namespace = file.attributes.original;

    const body = file.elements[0];
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
            unit[element.name] = element.elements ? extractValue(element.elements[0]) : undefined;
            break;
        }

        return unit;
      }, { source: '' });

      return file;
    }, {});

    return resources;
  }, {});

  cb(null, result);
}

module.exports = xliff12ToJs;
