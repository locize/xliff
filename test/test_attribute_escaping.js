const expect = require('expect.js')
const { js2xliff, xliff2js, jsToXliff12, xliff12ToJs } = require('../')

describe('attribute escaping', () => {
  const js = {
    sourceLanguage: 'en',
    targetLanguage: 'de',
    resources: {
      'terms&conditions': {
        key: { source: 's', target: 't', additionalAttributes: { resname: 'a&b <c>' } }
      }
    }
  }

  it('round-trips namespaces and attribute values through XLIFF 2.0', async () => {
    const xml = await js2xliff(js)
    expect(xml).to.contain('<file id="terms&amp;conditions">')
    expect((await xliff2js(xml)).resources).to.eql(js.resources)
  })

  it('round-trips namespaces and attribute values through XLIFF 1.2', async () => {
    const xml = await jsToXliff12(js)
    expect(xml).to.contain('original="terms&amp;conditions"')
    expect((await xliff12ToJs(xml)).resources).to.eql(js.resources)
  })
})
