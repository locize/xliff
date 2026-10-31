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

describe('createjs with inline elements', () => {
  it('keeps source and target arrays as they are', (done) => {
    const source = ['Hello ', { GenericSpan: { id: 'name', contents: '{name}' } }]
    const target = ['Hallo ', { GenericSpan: { id: 'name', contents: '{name}' } }]
    createjs(
      'en',
      'de',
      { key1: source },
      { key1: target },
      'namespace1',
      (err, res) => {
        expect(err).not.to.be.ok()
        expect(res.resources.namespace1.key1).to.eql({ source, target })
        done()
      }
    )
  })
})
