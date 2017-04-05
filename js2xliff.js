const xml2js = require('xml2js');

function js2xliff(obj, opt, cb) {

  if (typeof opt === 'function') {
    cb = opt;
    opt = { pretty: true, indent: ' ', newline: '\n' };
  }

  const builder = new xml2js.Builder({
    rootName: 'xliff',
    headless: true,
    pretty: opt.pretty,
    indent: opt.indent || ' ',
    newline: opt.newline || '\n'
  });

  const xmlJs = {
    $: {
      xmlns: 'urn:oasis:names:tc:xliff:document:2.0',
      version: '2.0',
      srcLang: obj.sourceLanguage,
      trgLang: obj.targetLanguage
    },
    file: []
  };

  Object.keys(obj.resources).forEach((nsName) => {
    const f = {
      $: {
        id: nsName
      },
      unit: []
    };
    xmlJs.file.push(f);

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const segment = {
        source: obj.resources[nsName][k].source,
        target: obj.resources[nsName][k].target
      };
      if ('note' in obj.resources[nsName][k]) {
        segment.note = obj.resources[nsName][k].note;
      }
      const u = {
        $: {
          id: k
        },
        segment
      };
      f.unit.push(u);
    });
  });

  const xml = builder.buildObject(xmlJs);
  if (cb) cb(null, xml);
  return xml;
}

module.exports = js2xliff;
