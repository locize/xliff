const expect = require('expect.js')
const { createjs } = require('../')

describe('createjs with nested keys', () => {
  it('builds groupUnits when no notes are passed', (done) => {
    createjs(
      'en',
      'de',
      { group: { 'in-group': 'Group source' } },
      { group: { 'in-group': 'Gruppe' } },
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res).to.eql({
          sourceLanguage: 'en',
          targetLanguage: 'de',
          resources: {
            namespace1: {
              group: {
                groupUnits: {
                  'in-group': { source: 'Group source', target: 'Gruppe' }
                }
              }
            }
          }
        })
        done()
      }
    )
  })
})
