const expect = require('expect.js')
const fs = require('fs')
const path = require('path')
const xliff2js = require('../lib/xliff2js').default

describe('XLIFF 2.2 plural/gender/select parsing', () => {
  it('parses plural/gender/select correctly', async () => {
    const xml = fs.readFileSync(path.join(__dirname, 'fixtures/xliff/2.2/with-plural-gender-select.xlf'), 'utf8')
    const js = await xliff2js(xml)
    expect(js).to.be.an('object')
    expect(js.resources).to.be.an('object')
    expect(js.resources.main).to.have.property('messages')
    expect(js.resources.main.messages.source).to.have.property('type', 'plural')
    expect(js.resources.main.messages.target).to.have.property('type', 'plural')
    expect(js.resources.main).to.have.property('greeting')
    expect(js.resources.main.greeting.source).to.have.property('type', 'select')
    expect(js.resources.main.greeting.target).to.have.property('type', 'select')
  })
})

describe('XLIFF 2.2 headerExtras and ref attribute', () => {
  const xliff2js = require('../lib/xliff2js').default
  const fs = require('fs')
  const path = require('path')
  it('parses headerExtras and ref attribute', async () => {
    const xml = fs.readFileSync(path.join(__dirname, 'fixtures/xliff/2.2/with-metadata-and-ref.xlf'), 'utf8')
    const js = await xliff2js(xml)
    expect(js.xliffVersion).to.be('2.2')
    expect(js.headerExtras).to.be.an('array')
    expect(js.headerExtras.length).to.be.greaterThan(0)
    expect(js.headerExtras[0].name).to.be('mda:metadata')
    expect(js.resources.main.welcome.additionalAttributes.ref).to.be('someRefValue')
  })
})
