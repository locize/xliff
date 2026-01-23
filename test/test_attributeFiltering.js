const expect = require('expect.js');
const { js2xliff } = require('../');

describe('attribute filtering', () => {
  it('should not export undefined or null attributes', (done) => {
    const js = {
      resources: {
        f1: {
          u1: {
            source: 'Hello',
            target: 'Hallo',
            additionalAttributes: {
              foo: undefined,
              bar: null,
              baz: 'bazval'
            }
          }
        }
      }
    };
    js2xliff(js, (err, xliffOut) => {
      expect(err).not.to.be.ok();
      expect(xliffOut).not.to.contain('foo=');
      expect(xliffOut).not.to.contain('bar=');
      expect(xliffOut).to.contain('baz="bazval"');
      done();
    });
  });
});
