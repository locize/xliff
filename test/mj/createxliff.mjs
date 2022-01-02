import createxliff from '../../lib/createxliff.js'

createxliff(
  'en-US',
  'de-CH',
  {
    key1: 'Hello',
    key2: 'An application to manipulate and process XLIFF documents',
    'key.nested': 'XLIFF Data Manager',
    group: {
      groupUnit: 'Group',
      nestedGroup: {
        otherUnit: 'Nested Group'
      }
    }
  },
  {
    key1: 'Hallo',
    key2: 'Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten',
    'key.nested': 'XLIFF Daten Manager',
    group: {
      groupUnit: 'Gruppe',
      nestedGroup: {
        otherUnit: 'Verschachtelte Gruppe'
      }
    }
  },
  'namespace1',
  null,
  {
    key1: 'custom note for key1',
    key2: ['custom note for key2', 'additional note for key2'],
    'key.nested': 'another note for nested key',
    // group: 'a note for the group item'
    group: {
      groupUnit: 'a note for the group item',
      nestedGroup: {
        otherUnit: ['nested group note', 'miscellaneous comment']
      }
    }
  }
)
  .then(res => {
    console.log(res)
  })
