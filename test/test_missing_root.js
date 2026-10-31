const expect = require('expect.js')
const { xliff2js, xliff12ToJs } = require('../')

describe('input without an xliff element', () => {
  it('reports an error through the callback of xliff2js', (done) => {
    xliff2js('<foo/>', (err, res) => {
      expect(err).to.be.an(Error)
      expect(res).not.to.be.ok()
      done()
    })
  })

  it('reports an error through the callback of xliff12ToJs', (done) => {
    xliff12ToJs('<foo/>', (err, res) => {
      expect(err).to.be.an(Error)
      expect(res).not.to.be.ok()
      done()
    })
  })

  it('rejects the promise of xliff2js for an empty string', () => {
    return xliff2js('').then(() => {
      throw new Error('expected a rejection')
    }, (err) => {
      expect(err).to.be.an(Error)
      expect(err.message).to.match(/does not contain an xliff element/)
    })
  })

  it('rejects the promise of xliff12ToJs for an empty string', () => {
    return xliff12ToJs('').then(() => {
      throw new Error('expected a rejection')
    }, (err) => {
      expect(err).to.be.an(Error)
      expect(err.message).to.match(/does not contain an xliff element/)
    })
  })
})
