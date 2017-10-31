const xml2js = require('xml2js');

function jsToXliff12(obj, opt, cb) {

  if (typeof opt === 'function') {
    cb = opt;
    opt = { headless: true, pretty: true, indent: ' ', newline: '\n' };
  }

  const builder = new xml2js.Builder({
    rootName: 'xliff',
    headless: opt.headless,
    pretty: opt.pretty,
    indent: opt.indent || ' ',
    newline: opt.newline || '\n'
  });

  const xmlJs = {
    $: {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd',
      xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
      version: '1.2'
    },
    file: []
  };

  Object.keys(obj.resources).forEach((nsName) => {
    const f = {
      $: {
        original: nsName,
        datatype: obj.datatype || 'plaintext',
        'source-language': obj.sourceLanguage,
        'target-language': obj.targetLanguage
      },
      'body': {
        'trans-unit': []
      }
    };
    xmlJs.file.push(f);

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const u = {
        $: {
          id: k,
          datatype: ''
        },
        source: obj.resources[nsName][k].source,
        target: obj.resources[nsName][k].target
      };
      if ('note' in obj.resources[nsName][k]) {
        u.note = obj.resources[nsName][k].note;
      }
      if ('datatype' in obj.resources[nsName][k]) {
        u.$.datatype = obj.resources[nsName][k].datatype;
      }
      f.body['trans-unit'].push(u);
    });
  });

  const xml = builder.buildObject(xmlJs);
  if (cb) cb(null, xml);
  return xml;
}

module.exports = jsToXliff12;
