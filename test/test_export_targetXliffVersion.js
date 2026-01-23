const expect = require('expect.js')
const fs = require('fs')
const path = require('path')
const xliff2js = require('../lib/xliff2js').default
const js2xliff = require('../lib/js2xliff').default

describe('js2xliff targetXliffVersion export option', () => {
  let jsModel
  before(async () => {
    const xml = fs.readFileSync(path.join(__dirname, 'fixtures/xliff/2.2/with-plural-gender-select.xlf'), 'utf8')
    jsModel = await xliff2js(xml)
  })

  it('exports plural/select as plain text for 2.0 (default)', async () => {
    const xliff = await js2xliff(jsModel)
    expect(xliff).to.be.a('string')
    expect(xliff).to.not.contain('<plural')
    expect(xliff).to.not.contain('<select')
    expect(xliff).to.contain('One message')
    expect(xliff).to.contain('He says hi')
  })

  it('exports plural/select as elements for 2.2', async () => {
    const xliff = await js2xliff(jsModel, { targetXliffVersion: '2.2' })
    expect(xliff).to.be.a('string')
    expect(xliff).to.contain('<plural')
    expect(xliff).to.contain('<select')
    expect(xliff).to.contain('One message')
    expect(xliff).to.contain('He says hi')
  })
})
