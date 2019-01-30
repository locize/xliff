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

  test('jsToXliff12', (fn) => (done) => {
    fn(fixtures.example.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example.xliff12);
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
    fn(
      fixtures.example.js.sourceLanguage,
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
    fn(
      fixtures.example.js.sourceLanguage,
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

  test('createxliff12', (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example.xliff12);
        done();
      }
    );
  });

});

describe('xliff 1.2 source/target attributes', () => {

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_source_attr.xliff12, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example.js);
      done();
    });
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
    fn(
      fixtures.example_multi.js.sourceLanguage,
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
    fn(
      fixtures.example_multi.js.sourceLanguage,
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

describe('with notes', () => {

  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_note.xliff, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example_note.js);
      done();
    });
  });

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_note.xliff12, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example_note.js);
      done();
    });
  });

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example_note.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res).to.eql(fixtures.example_note.xliff);
      done();
    });
  });

  test('targetOfjs', (fn) => (done) => {
    fn(fixtures.example_note.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res.namespace1['key.nested']).to.eql(fixtures.example_note.js.resources.namespace1['key.nested'].target);
      expect(res.namespace2['k']).to.eql(fixtures.example_note.js.resources.namespace2['k'].target);
      done();
    });
  });

  test('sourceOfjs', (fn) => (done) => {
    fn(fixtures.example_note.js, (err, res) => {
      expect(err).not.to.be.ok();
      expect(res.namespace1['key.nested']).to.eql(fixtures.example_note.js.resources.namespace1['key.nested'].source);
      expect(res.namespace2['k']).to.eql(fixtures.example_note.js.resources.namespace2['k'].source);
      done();
    });
  });

});

describe('with additional attributes', () => {
  describe('xliff 2.0', () => {
    test('xliff2js', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.xliff, (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example_additional_attributes.js);
        done();
      });
    });
    test('js2xliff', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.js, (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example_additional_attributes.xliff);
        done();
      });
    });
  });
  describe('xliff 1.2', () => {
    test('xliff12ToJs', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.xliff12, (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example_additional_attributes.js);
        done();
      });
    });
    test('jsToXliff12', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.js, (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example_additional_attributes.xliff12);
        done();
      });
    });
  });
});
