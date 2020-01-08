const convert = require('xml-js');
const ElementTypes12 = require('./inline-elements/ElementTypes12');
const makeElement = require('./xml-js/objectToXml').makeElement;
const makeText = require('./xml-js/objectToXml').makeText;
const makeValue = require('./xml-js/objectToXml').makeValue;
const escape = require('./util/escape');

function jsToXliff12(obj, opt, cb) {

  if (typeof opt === 'function') {
    cb = opt;
    opt = { indent: '  ' };
  }

  const options = {
    spaces: opt.indent || '  ',
    xmlLangAttr: !!opt.xmlLangAttr
  };

  const rootAttributes = {
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xsi:schemaLocation': 'urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd',
    xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
    version: '1.2'
  };
  const root = makeElement('xliff', rootAttributes, true);

  Object.keys(obj.resources).forEach((nsName) => {
    const b = makeElement('body', null, true);
    const fileAttributes = {
      original: nsName,
      datatype: 'plaintext',
      'source-language': obj.sourceLanguage,
    };
    if (obj.targetLanguage != null) {
      fileAttributes['target-language'] = obj.targetLanguage;
    }
    const f = makeElement('file', fileAttributes, [b]);
    root.elements.push(f);

    Object.keys(obj.resources[nsName]).forEach((key) => {
      if (obj.resources[nsName][key].groupUnits) {
        b.elements.push(createGroupUnitTag(key, obj.resources[nsName][key], obj, options));
      } else {
        b.elements.push(createTransUnitTag(key, obj.resources[nsName][key], obj, options));
      }
    });
  });

  const xmlJs = {
    elements: [root]
  };

  const xml = convert.js2xml(xmlJs, options);
  if (cb) cb(null, xml);
  return xml;
}

function createGroupUnitTag(key, resource, obj, options) {
  const additionalAttributes = resource.additionalAttributes != null ? resource.additionalAttributes : {};
  const u = makeElement('group', Object.assign({id: escape(key)}, additionalAttributes), true);
  Object.keys(resource.groupUnits).forEach((transUnitKey) => {
    u.elements.push(createTransUnitTag(transUnitKey, resource.groupUnits[transUnitKey], obj, options));
  });
  return u;
}

function createTransUnitTag(key, resource, obj, options) {
  const additionalAttributes = resource.additionalAttributes != null ? resource.additionalAttributes : {};
  const u = makeElement('trans-unit', Object.assign({id: escape(key)}, additionalAttributes), true);
  let sourceAttributes = null;
  if (options.xmlLangAttr) {
    sourceAttributes = {
      'xml:lang': obj.sourceLanguage
    };
  }
  u.elements.push(makeElement('source', sourceAttributes, makeValue(resource.source, ElementTypes12)));
  if (resource.target != null) {
    let targetAttributes = null;
    if (options.xmlLangAttr && obj.targetLanguage) {
      targetAttributes = {
        'xml:lang': obj.targetLanguage
      };
    }
    u.elements.push(makeElement('target', targetAttributes, makeValue(resource.target, ElementTypes12)));
  }
  if ('note' in resource) {
    u.elements.push(makeElement('note', null, [makeText(resource.note)]));
  }

  return u;
}

module.exports = jsToXliff12;
