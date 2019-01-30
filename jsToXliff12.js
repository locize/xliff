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
    spaces: opt.indent || '  '
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

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const additionalAttributes = obj.resources[nsName][k].additionalAttributes != null ? obj.resources[nsName][k].additionalAttributes : {};
      const u = makeElement('trans-unit', Object.assign({id: escape(k)}, additionalAttributes), true);
      u.elements.push(makeElement('source', null, makeValue(obj.resources[nsName][k].source, ElementTypes12)));
      if (obj.resources[nsName][k].target != null) {
        u.elements.push(makeElement('target', null, makeValue(obj.resources[nsName][k].target, ElementTypes12)));
      }
      if ('note' in obj.resources[nsName][k]) {
        u.elements.push(makeElement('note', null, [makeText(obj.resources[nsName][k].note)]));
      }
      b.elements.push(u);
    });
  });

  const xmlJs = {
    elements: [root]
  };

  const xml = convert.js2xml(xmlJs, options);
  if (cb) cb(null, xml);
  return xml;
}

module.exports = jsToXliff12;
