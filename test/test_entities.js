const expect = require('expect.js')
const { js2xliff, xliff2js, jsToXliff12, xliff12ToJs } = require('../')

describe('literal entity text', () => {
  const js = {
    sourceLanguage: 'en',
    targetLanguage: 'de',
    resources: {
      ns: {
        key: { source: 'Tom &amp; Jerry & co', target: 'a &lt; b', note: ['x &amp; y', 'z'] }
      }
    }
  }

  it('round-trips through XLIFF 2.0', async () => {
    const xml = await js2xliff(js)
    expect(xml).to.contain('<source>Tom &amp;amp; Jerry &amp; co</source>')
    expect((await xliff2js(xml)).resources).to.eql(js.resources)
  })

  it('round-trips through XLIFF 1.2', async () => {
    const xml = await jsToXliff12(js)
    expect(xml).to.contain('<source>Tom &amp;amp; Jerry &amp; co</source>')
    expect((await xliff12ToJs(xml)).resources).to.eql(js.resources)
  })
})
