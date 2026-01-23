const expect = require('expect.js');
const { xliff2js, js2xliff } = require('../');

const headerExtrasXliff = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0">
  <extra1 foo="bar" />
  <extra2 />
  <file id="f1" original="o1" source-language="en" target-language="de">
    <unit id="u1">
      <segment>
        <source>Hello</source>
        <target>Hallo</target>
      </segment>
    </unit>
  </file>
</xliff>`;

const expectedJs = {
  resources: {
    f1: {
      u1: {
        source: 'Hello',
        target: 'Hallo'
      }
    }
  },
  headerExtras: [
    { type: 'element', name: 'extra1', attributes: { foo: 'bar' } },
    { type: 'element', name: 'extra2' }
  ]
};

describe('headerExtras round-trip', () => {
  it('should parse headerExtras from XLIFF and export them back', (done) => {
    xliff2js(headerExtrasXliff, (err, js) => {
      expect(err).not.to.be.ok();
      expect(js.headerExtras).to.eql(expectedJs.headerExtras);
      js2xliff(js, (err2, xliffOut) => {
        expect(err2).not.to.be.ok();
        expect(xliffOut).to.contain('<extra1 foo="bar"');
        expect(xliffOut).to.contain('<extra2');
        done();
      });
    });
  });
});
