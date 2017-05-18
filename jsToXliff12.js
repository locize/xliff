const convert = require('xml-js');

function jsToXliff12(obj, opt, cb) {

  if (typeof opt === 'function') {
    cb = opt;
    opt = { indent: '  ' };
  }

  const options = {
    spaces: opt.indent || '  '
  };

  const root = {
    type: 'element',
    name: 'xliff',
    attributes: {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd',
      xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
      version: '1.2'
    },
    elements: []
  };

  Object.keys(obj.resources).forEach((nsName) => {
    const b = {
      type: 'element',
      name: 'body',
      elements: []
    };

    const f = {
      type: 'element',
      name: 'file',
      attributes: {
        original: nsName,
        datatype: 'plaintext',
        'source-language': obj.sourceLanguage,
        'target-language': obj.targetLanguage
      },
      elements: [b]
    };
    root.elements.push(f);

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const u = {
        type: 'element',
        name: 'trans-unit',
        attributes: {
          id: k
        },
        elements: [
          {
            type: 'element',
            name: 'source',
            elements: [
              {
                type: 'text',
                text: obj.resources[nsName][k].source
              }
            ]
          },
          {
            type: 'element',
            name: 'target',
            elements: [
              {
                type: 'text',
                text: obj.resources[nsName][k].target
              }
            ]
          }
        ]
      };
      if ('note' in obj.resources[nsName][k]) {
        u.elements.push({
          type: 'element',
          name: 'note',
          elements: [
            {
              type: 'text',
              text: obj.resources[nsName][k].note
            }
          ]
        });
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
