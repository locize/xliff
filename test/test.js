const expect = require('expect.js');
const fixtures = require('./fixtures');

function test(what, t) {
  describe(what, () => {
    it('index', t(require('../')[what]));
    it('direct', t(require('../' + what)));
  });
}

describe('single', () => {

  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example.xliff, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example.js);
      done();
    });
  });

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example.xliff12, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example.js);
      done();
    });
  });

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example.xliff);
      done();
    });
  });

  test('targetOfjs', (fn) => (done) => {
    fn(fixtures.example.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res['key.nested']).to.eql(fixtures.example.js.resources.namespace1['key.nested'].target);
      done();
    });
  });

  test('sourceOfjs', (fn) => (done) => {
    fn(fixtures.example.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res['key.nested']).to.eql(fixtures.example.js.resources.namespace1['key.nested'].source);
      done();
    });
  });

  test('createjs', (fn) => (done) => {
    fn(fixtures.example.js.sourceLanguage,
       fixtures.example.js.targetLanguage,
       fixtures.example.js_source,
       fixtures.example.js_target,
       'namespace1',
       (err, res) => {
         expect(err).not.to.be.ok();
         expect(res).to.eql(fixtures.example.js);
         done();
       }
    );
  });

  test('createxliff', (fn) => (done) => {
    fn(fixtures.example.js.sourceLanguage,
       fixtures.example.js.targetLanguage,
       fixtures.example.js_source,
       fixtures.example.js_target,
       'namespace1',
       (err, res) => {
         expect(err).not.to.be.ok();
         expect(res).to.eql(fixtures.example.xliff);
         done();
       }
    );
  });

});

describe('multi', () => {

  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_multi.xliff, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example_multi.js);
      done();
    });
  });

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_multi.xliff12, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example_multi.js);
      done();
    });
  });

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example_multi.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example_multi.xliff);
      done();
    });
  });

  test('targetOfjs', (fn) => (done) => {
    fn(fixtures.example_multi.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res.namespace1['key.nested']).to.eql(fixtures.example_multi.js.resources.namespace1['key.nested'].target);
      expect(res.namespace2['k']).to.eql(fixtures.example_multi.js.resources.namespace2['k'].target);
      done();
    });
  });

  test('sourceOfjs', (fn) => (done) => {
    fn(fixtures.example_multi.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res.namespace1['key.nested']).to.eql(fixtures.example_multi.js.resources.namespace1['key.nested'].source);
      expect(res.namespace2['k']).to.eql(fixtures.example_multi.js.resources.namespace2['k'].source);
      done();
    });
  });

  test('createjs', (fn) => (done) => {
    fn(fixtures.example_multi.js.sourceLanguage,
       fixtures.example_multi.js.targetLanguage,
       fixtures.example_multi.js_source,
       fixtures.example_multi.js_target,
       (err, res) => {
         expect(err).not.to.be.ok();
         expect(res).to.eql(fixtures.example_multi.js);
         done();
       }
    );
  });

  test('createxliff', (fn) => (done) => {
    fn(fixtures.example_multi.js.sourceLanguage,
       fixtures.example_multi.js.targetLanguage,
       fixtures.example_multi.js_source,
       fixtures.example_multi.js_target,
       (err, res) => {
         expect(err).not.to.be.ok();
         expect(res).to.eql(fixtures.example_multi.xliff);
         done();
       }
    );
  });

});
