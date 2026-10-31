const expect = require('expect.js')
const { createxliff, createxliff12 } = require('../')

describe('createxliff with shapes that are not inline segments', () => {
  it('keeps the group units when only one side is an array', (done) => {
    createxliff(
      'en',
      'de',
      { group: { a: 'Source A', b: 'Source B' } },
      { group: ['Target A', 'Target B'] },
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.contain('<unit id="a">')
        expect(res).to.contain('<unit id="b">')
        expect(res).to.contain('Source A')
        expect(res).to.contain('Source B')
        done()
      }
    )
  })

  it('keeps the text of nested arrays', (done) => {
    createxliff(
      'en',
      'de',
      { key: [['a'], ['b']] },
      { key: [['A'], ['B']] },
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.contain('>a<')
        expect(res).to.contain('>b<')
        done()
      }
    )
  })
})

describe('createxliff without a namespace', () => {
  it('resolves the promise of createxliff for nested keys', () => {
    return createxliff(
      'en',
      'de',
      { ns1: { group: { key: 'Source' } } },
      { ns1: { group: { key: 'Target' } } }
    ).then((res) => {
      expect(res).to.contain('Source')
      expect(res).to.contain('Target')
    })
  })

  it('resolves the promise of createxliff12 for nested keys', () => {
    return createxliff12(
      'en',
      'de',
      { ns1: { group: { key: 'Source' } } },
      { ns1: { group: { key: 'Target' } } }
    ).then((res) => {
      expect(res).to.contain('Source')
      expect(res).to.contain('Target')
    })
  })
})
