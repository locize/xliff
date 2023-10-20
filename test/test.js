const expect = require('expect.js')
const fixtures = require('./fixtures')

function test (what, t, comment = "") {
  describe(what + " " + comment, () => {
    it('index', t(require('../')[what]))
    it('direct', t(require('../cjs/' + what)))
  })
}

describe('single', () => {
  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.js)
      done()
    })
  })

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.js)
      done()
    })
  })

  describe('angular', () => {
    test('xliff12ToJs', (fn) => (done) => {
      fn(fixtures.example_angular.xliff12, { namespace: 'example_angular' }, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_angular.js)
        done()
      })
    })

    test('xliff2js', (fn) => (done) => {
      fn(fixtures.example_angular.xliff, { namespace: 'example_angular' }, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_angular.js)
        done()
      })
    })
  })

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example.js, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.xliff)
      done()
    })
  })

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example.js, {indent: false}, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.xliff_compact)
      done()
    })
  }, "with {indent: false}")

  test('jsToXliff12', (fn) => (done) => {
    fn(fixtures.example.js, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.xliff12)
      done()
    })
  })

  test('jsToXliff12', (fn) => (done) => {
    fn(fixtures.example.js, {indent: false}, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.xliff12_compact)
      done()
    })
  }, "with {indent: false}")

  test('targetOfjs', (fn) => () => {
    const res = fn(fixtures.example.js)
    expect(res['key.nested']).to.eql(fixtures.example.js.resources.namespace1['key.nested'].target)
    const res2 = fn(fixtures.example_groups.js)
    expect(res2['standalone']).to.eql(fixtures.example_groups.js.resources.namespace1['standalone'].target)
    expect(res2['group1']['in-group']).to.eql(
      fixtures.example_groups.js.resources.namespace1['group1'].groupUnits['in-group'].target)
    expect(res2['group1']['nested-group1']['in-nested-group']).to.eql(
      fixtures.example_groups.js.resources.namespace1['group1'].groupUnits['nested-group1'].groupUnits['in-nested-group'].target)
  })

  test('sourceOfjs', (fn) => () => {
    const res = fn(fixtures.example.js)
    expect(res['key.nested']).to.eql(fixtures.example.js.resources.namespace1['key.nested'].source)
    const res2 = fn(fixtures.example_groups.js)
    expect(res2['standalone']).to.eql(fixtures.example_groups.js.resources.namespace1['standalone'].source)
    expect(res2['group1']['in-group']).to.eql(
      fixtures.example_groups.js.resources.namespace1['group1'].groupUnits['in-group'].source)
    expect(res2['group1']['nested-group1']['in-nested-group']).to.eql(
      fixtures.example_groups.js.resources.namespace1['group1'].groupUnits['nested-group1'].groupUnits['in-nested-group'].source)
  })

  test('createjs', (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example.js)
        done()
      }
    )
  })

  test("createjs", (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      "namespace1",
      (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example.js_output_notes);
        done();
      },
      fixtures.example.js_input_notes
    );
  }, "with notes")

  test('createxliff', (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example.xliff)
        done()
      }
    )
  })

  test("createxliff", (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      "namespace1",
      (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example.xliff_output_notes);
        done();
      },
      fixtures.example.js_input_notes
    );
  }, "with notes")

  test('createxliff12', (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example.xliff12)
        done()
      }
    )
  })

  test("createxliff12", (fn) => (done) => {
    fn(
      fixtures.example.js.sourceLanguage,
      fixtures.example.js.targetLanguage,
      fixtures.example.js_source,
      fixtures.example.js_target,
      "namespace1",
      (err, res) => {
        expect(err).not.to.be.ok();
        expect(res).to.eql(fixtures.example.xliff12_output_notes);
        done();
      },
      fixtures.example.js_input_notes
    );
  }, "with notes")
})

describe('xliff with different keys', () => {
  test('createxliff12', (fn) => (done) => {
    fn(
      fixtures.example_diff.js.sourceLanguage,
      fixtures.example_diff.js.targetLanguage,
      fixtures.example_diff.js_source,
      fixtures.example_diff.js_target,
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        console.log(res)
        expect(res).to.eql(fixtures.example_diff.xliff12)
        done()
      }
    )
  })

  test('createxliff', (fn) => (done) => {
    fn(
      fixtures.example_diff.js.sourceLanguage,
      fixtures.example_diff.js.targetLanguage,
      fixtures.example_diff.js_source,
      fixtures.example_diff.js_target,
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_diff.xliff)
        done()
      }
    )
  })

  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_diff.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_diff.js)
      done()
    })
  })

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_diff.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_diff.js)
      done()
    })
  })
})

describe('xliff 1.2 source/target attributes', () => {
  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_source_attr.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example.js)
      done()
    })
  })
})

describe('xliff 1.2 empty file', () => {
  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_empty.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql({ resources: {} })
      done()
    })
  })
})


describe('multi', () => {
  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_multi.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_multi.js)
      done()
    })
  })

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_multi.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_multi.js)
      done()
    })
  })

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example_multi.js, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_multi.xliff)
      done()
    })
  })

  test('targetOfjs', (fn) => () => {
    const res = fn(fixtures.example_multi.js)
    expect(res.namespace1['key.nested']).to.eql(fixtures.example_multi.js.resources.namespace1['key.nested'].target)
    expect(res.namespace2.k).to.eql(fixtures.example_multi.js.resources.namespace2.k.target)
  })

  test('sourceOfjs', (fn) => () => {
    const res = fn(fixtures.example_multi.js)
    expect(res.namespace1['key.nested']).to.eql(fixtures.example_multi.js.resources.namespace1['key.nested'].source)
    expect(res.namespace2.k).to.eql(fixtures.example_multi.js.resources.namespace2.k.source)
  })

  test('createjs', (fn) => (done) => {
    fn(
      fixtures.example_multi.js.sourceLanguage,
      fixtures.example_multi.js.targetLanguage,
      fixtures.example_multi.js_source,
      fixtures.example_multi.js_target,
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_multi.js)
        done()
      }
    )
  })

  test('createxliff', (fn) => (done) => {
    fn(
      fixtures.example_multi.js.sourceLanguage,
      fixtures.example_multi.js.targetLanguage,
      fixtures.example_multi.js_source,
      fixtures.example_multi.js_target,
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_multi.xliff)
        done()
      }
    )
  })
})

describe('with notes', () => {
  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_note.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_note.js)
      done()
    })
  })

  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_note.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_note.js)
      done()
    })
  })

  test('js2xliff', (fn) => (done) => {
    fn(fixtures.example_note.js, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_note.xliff)
      done()
    })
  })

  test('targetOfjs', (fn) => () => {
    const res = fn(fixtures.example_note.js)
    expect(res.namespace1['key.nested']).to.eql(fixtures.example_note.js.resources.namespace1['key.nested'].target)
    expect(res.namespace2.k).to.eql(fixtures.example_note.js.resources.namespace2.k.target)
    expect(res.namespace1['group1']['in-group']).to.eql(
      fixtures.example_note.js.resources.namespace1['group1'].groupUnits['in-group'].target)
    expect(res.namespace1['group1']['nested-group1']['in-nested-group']).to.eql(
      fixtures.example_note.js.resources.namespace1['group1'].groupUnits['nested-group1'].groupUnits['in-nested-group'].target)
  })

  test('sourceOfjs', (fn) => () => {
    const res = fn(fixtures.example_note.js)
    expect(res.namespace1['key.nested']).to.eql(fixtures.example_note.js.resources.namespace1['key.nested'].source)
    expect(res.namespace2.k).to.eql(fixtures.example_note.js.resources.namespace2.k.source)
    expect(res.namespace1['group1']['in-group']).to.eql(
      fixtures.example_note.js.resources.namespace1['group1'].groupUnits['in-group'].source)
    expect(res.namespace1['group1']['nested-group1']['in-nested-group']).to.eql(
      fixtures.example_note.js.resources.namespace1['group1'].groupUnits['nested-group1'].groupUnits['in-nested-group'].source)
  })
})

describe('with additional attributes', () => {
  describe('xliff 2.0', () => {
    test('xliff2js', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.xliff, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_additional_attributes.js)
        done()
      })
    })
    test('js2xliff', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.js, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_additional_attributes.xliff)
        done()
      })
    })
  })
  describe('xliff 1.2', () => {
    test('xliff12ToJs', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.xliff12, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_additional_attributes.js)
        done()
      })
    })
    test('jsToXliff12', (fn) => (done) => {
      fn(fixtures.example_additional_attributes.js, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_additional_attributes.xliff12)
        done()
      })
    })
  })
})

describe('with sizeRestriction attribute', () => {
  describe('xliff 2.0', () => {
    test('xliff2js', (fn) => (done) => {
      fn(fixtures.example_sizeRestriction.xliff, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_sizeRestriction.js)
        done()
      })
    })
    test('js2xliff', (fn) => (done) => {
      fn(fixtures.example_sizeRestriction.js, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_sizeRestriction.xliff)
        done()
      })
    })
  })
})

describe('Google Actions Xliff', () => {
  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_google.xliff12, { xmlLangAttr: true }, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_google.js)
      done()
    })
  })

  test('jsToXliff12', (fn) => (done) => {
    fn(fixtures.example_google.js, { xmlLangAttr: true }, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_google.xliff12)
      done()
    })
  })
})

describe('groups', () => {
  describe('xliff 2.0', () => {
    test('xliff2js', (fn) => (done) => {
      fn(fixtures.example_groups.xliff, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_groups.js)
        done()
      })
    })
    test('js2xliff', (fn) => (done) => {
      fn(fixtures.example_groups.js, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_groups.xliff)
        done()
      })
    })
  })
  describe('xliff 1.2', () => {
    test('xliff12ToJs', (fn) => (done) => {
      fn(fixtures.example_groups.xliff12, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_groups.js)
        done()
      })
    })
    test('jsToXliff12', (fn) => (done) => {
      fn(fixtures.example_groups.js, (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql(fixtures.example_groups.xliff12)
        done()
      })
    })
  })
})

describe('CDATA Sections', () => {
  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_cdata.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_cdata.js)
      done()
    })
  })
  test('xliff12ToJs', (fn) => (done) => {
    fn(fixtures.example_cdata.xliff12, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_cdata.js)
      done()
    })
  })
})

describe('Comments', () => {
  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_comments.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_comments.js)
      done()
    })
  })
})

describe('Ignorable non-segments', ()=>{
  test('xliff2js', (fn) => (done) => {
    fn(fixtures.example_ignorable.xliff, (err, res) => {
      expect(err).not.to.be.ok()
      expect(res).to.eql(fixtures.example_ignorable.js)
      done()
    })
  })
})
