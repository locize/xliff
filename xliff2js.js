const convert = require('xml-js');

function xliffToJs(str, cb) {
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
              unit[element.name] = element.elements ? extractValue(element.elements[0]) : undefined;
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
