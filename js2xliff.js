const convert = require('xml-js');
const makeElement = require('./util/makeNodes').makeElement;
const makeText = require('./util/makeNodes').makeText;

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
      segment.elements.push(makeElement('source', null, [makeText(obj.resources[nsName][k].source)]));
      segment.elements.push(makeElement('target', null, [makeText(obj.resources[nsName][k].target)]));
      if ('note' in obj.resources[nsName][k]) {
        segment.elements.push(makeElement('note', null, [makeText(obj.resources[nsName][k].note)]));
      }
      const u = makeElement('unit', {id: k}, [segment]);
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
