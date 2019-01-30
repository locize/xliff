const convert = require('xml-js');
const ElementTypes2 = require('./inline-elements/ElementTypes2');
const makeElement = require('./xml-js/objectToXml').makeElement;
const makeText = require('./xml-js/objectToXml').makeText;
const makeValue = require('./xml-js/objectToXml').makeValue;
const escape = require('./util/escape');

function js2xliff(obj, opt, cb) {

  if (typeof opt === 'function') {
    cb = opt;
    opt = { indent: '  ' };
  }

  const options = {
    spaces: opt.indent || '  '
  };

  const rootAttributes = {
    xmlns: 'urn:oasis:names:tc:xliff:document:2.0',
    version: '2.0',
    srcLang: obj.sourceLanguage,
    trgLang: obj.targetLanguage
  };
  const root = makeElement('xliff', rootAttributes, true);

  Object.keys(obj.resources).forEach((nsName) => {
    const f = makeElement('file', {id: nsName}, true);
    root.elements.push(f);

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const segment = makeElement('segment', null, true);
      segment.elements.push(makeElement('source', null, makeValue(obj.resources[nsName][k].source, ElementTypes2)));
      segment.elements.push(makeElement('target', null, makeValue(obj.resources[nsName][k].target, ElementTypes2)));
      if ('note' in obj.resources[nsName][k]) {
        segment.elements.push(makeElement('note', null, [makeText(obj.resources[nsName][k].note)]));
      }
      const additionalAttributes = obj.resources[nsName][k].additionalAttributes != null ? obj.resources[nsName][k].additionalAttributes : {};
      const u = makeElement('unit', Object.assign({id: escape(k)}, additionalAttributes), [segment]);
      f.elements.push(u);
    });
  });

  const xmlJs = {
    elements: [root]
  };

  const xml = convert.js2xml(xmlJs, options);
  if (cb) cb(null, xml);
  return xml;
}

module.exports = js2xliff;
