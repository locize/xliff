const expect = require('expect.js');
const fixtures = require('./fixtures');

function test(what, t) {
  describe(what, function() {
    it('index', t(require('../')[what]));
    it('direct', t(require('../' + what)));
  });
}

describe('single', function() {

  test('xliff2js', function(fn) {
    return function(done) {
      return fn(fixtures.example.xliff, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example.js);
        done();
      });
    };
  });

  test('js2xliff', function(fn) {
    return function(done) {
      return fn(fixtures.example.js, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example.xliff);
        done();
      });
    };
  });

  test('targetOfjs', function(fn) {
    return function(done) {
      return fn(fixtures.example.js, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res['key.nested']).to.eql(fixtures.example.js.resources.namespace1['key.nested'].target);
        done();
      });
    };
  });

  test('sourceOfjs', function(fn) {
    return function(done) {
      return fn(fixtures.example.js, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res['key.nested']).to.eql(fixtures.example.js.resources.namespace1['key.nested'].source);
        done();
      });
    };
  });

  test('createjs', function(fn) {
    return function(done) {
      return fn(fixtures.example.js.sourceLanguage,
        fixtures.example.js.targetLanguage,
        fixtures.example.js_source,
        fixtures.example.js_target,
        'namespace1',
        function(err, res) {
          expect(err).not.to.be.ok();
          expect(res).to.eql(fixtures.example.js);
          done();
        }
      );
    };
  });

  test('createxliff', function(fn) {
    return function(done) {
      return fn(fixtures.example.js.sourceLanguage,
          fixtures.example.js.targetLanguage,
          fixtures.example.js_source,
          fixtures.example.js_target,
          'namespace1',
          function(err, res) {
            expect(err).not.to.be.ok();
            expect(res).to.eql(fixtures.example.xliff);
            done();
          }
      );
    };
  });

});

describe('multi', function() {
  test('xliff2js', function(fn) {
    return function(done) {
      return fn(fixtures.example_multi.xliff, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example_multi.js);
        done();
      });
    };
  });

  test('js2xliff', function(fn) {
    return function(done) {
      return fn(fixtures.example_multi.js, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example_multi.xliff);
        done();
      });
    };
  });

  test('targetOfjs', function(fn) {
    return function(done) {
      return fn(fixtures.example_multi.js, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res.namespace1['key.nested']).to.eql(fixtures.example_multi.js.resources.namespace1['key.nested'].target);
        expect(res.namespace2['k']).to.eql(fixtures.example_multi.js.resources.namespace2['k'].target);
        done();
      });
    };
  });

  test('sourceOfjs', function(fn) {
    return function(done) {
      return fn(fixtures.example_multi.js, function(err, res) {
        expect(err).not.to.be.ok();
        expect(res.namespace1['key.nested']).to.eql(fixtures.example_multi.js.resources.namespace1['key.nested'].source);
        expect(res.namespace2['k']).to.eql(fixtures.example_multi.js.resources.namespace2['k'].source);
        done();
      });
    };
  });

  test('createjs', function(fn) {
    return function(done) {
      return fn(fixtures.example_multi.js.sourceLanguage,
        fixtures.example_multi.js.targetLanguage,
        fixtures.example_multi.js_source,
        fixtures.example_multi.js_target,
        function(err, res) {
          expect(err).not.to.be.ok();
          expect(res).to.eql(fixtures.example_multi.js);
          done();
        }
      );
    };
  });

  test('createxliff', function(fn) {
    return function(done) {
      return fn(fixtures.example_multi.js.sourceLanguage,
        fixtures.example_multi.js.targetLanguage,
        fixtures.example_multi.js_source,
        fixtures.example_multi.js_target,
        function(err, res) {
          expect(err).not.to.be.ok();
          expect(res).to.eql(fixtures.example_multi.xliff);
          done();
        }
      );
    };
  });

});
