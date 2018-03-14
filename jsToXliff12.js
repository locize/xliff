const convert = require('xml-js');
const makeElement = require('./util/makeNodes').makeElement;
const makeText = require('./util/makeNodes').makeText;

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
      'target-language': obj.targetLanguage
    };
    const f = makeElement('file', fileAttributes, [b]);
    root.elements.push(f);

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const u = makeElement('trans-unit', {id: k}, true);
      u.elements.push(makeElement('source', null, [makeText(obj.resources[nsName][k].source)]));
      u.elements.push(makeElement('target', null, [makeText(obj.resources[nsName][k].target)]));
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
