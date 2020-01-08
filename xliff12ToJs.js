const convert = require('xml-js');
const ElementTypes12 = require('./inline-elements/ElementTypes12');
const extractValue = require('./xml-js/xmlToObject').extractValue;

function xliff12ToJs(str, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  if (options === undefined && cb === undefined) {
    options = {};
  }
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
  if (!result.targetLanguage) delete result.targetLanguage;

  result.resources = xliffRoot.elements.reduce((resources, file) => {
    const namespace = options.namespace || file.attributes.original;

    const body = file.elements.find((e) => e.name === 'body');
    body.elements = body.elements || [];
    const transUnits = body.elements.filter(
      (transunit) => transunit.type !== 'comment'
    );

    // namespace
    resources[namespace] = transUnits.reduce((file, transUnit) => {
      const key = transUnit.attributes.id;
      const childs = transUnit.elements.filter((e) => e.name === 'trans-unit');
      if (childs.length) {
        file[key] = createGroupTag(transUnit, childs);
      } else {
        file[key] = createTransUnitTag(transUnit);
      }

      return file;
    }, {});

    return resources;
  }, {});

  if (cb) return cb(null, result);
  return result;
}

function createTransUnitTag(transUnit) {
  const additionalAttributes = transUnit.attributes;
  delete additionalAttributes.id;

  const jsUnit = transUnit.elements.reduce((unit, element) => {
    switch (element.name) {
      case 'source':
      case 'target':
      case 'note':
        unit[element.name] = extractValue(element.elements, ElementTypes12);
        break;
    }

    return unit;
  }, {});

  if (Object.keys(additionalAttributes).length) {
    Object.assign(jsUnit, { additionalAttributes });
  }
  return jsUnit;
}

function createGroupTag(groupUnit, childs) {
  const additionalAttributes = groupUnit.attributes;
  delete additionalAttributes.id;

  const jsGroupUnit = {
    groupUnits: childs.reduce((groupFile, groupTransUnit) => {
      const key = groupTransUnit.attributes.id;
      groupFile[key] = createTransUnitTag(groupTransUnit);
      return groupFile;
    }, {})
  };

  if (Object.keys(additionalAttributes).length) {
    Object.assign(jsGroupUnit, { additionalAttributes });
  }

  return jsGroupUnit;
}

module.exports = xliff12ToJs;
