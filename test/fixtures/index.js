const fs = require('fs')
const path = require('path')
const fixNewLines = require('./fixNewLines')

module.exports = {
  example: {
    js: require('./example.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example.xliff')).toString()),
    xliff_output_notes: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_output_note.xliff')).toString()),
    xliff_compact: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_compact.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example12.xliff')).toString()),
    xliff12_output_notes: fixNewLines(fs.readFileSync(path.join(__dirname, 'example12_output_note.xliff')).toString()),
    xliff12_compact: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_compact12.xliff')).toString()),
    js_source: require('./example_source.json'),
    js_target: require('./example_target.json'),
    js_input_notes: require('./example_input_note.json'),
    js_output_notes: require('./example_output_note.json')
  },
  example_source_attr: {
    // The JS should be the same as example.js
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_source_attr12.xliff')).toString())
  },
  example_multi: {
    js: require('./example_multi.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_multi.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_multi12.xliff')).toString()),
    js_source: require('./example_multi_source.json'),
    js_target: require('./example_multi_target.json')
  },
  example_note: {
    js: require('./example_note.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_note.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_note12.xliff')).toString())
  },
  example_additional_attributes: {
    js: require('./example_additional_attributes'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_additional_attributes.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_additional_attributes12.xliff')).toString())
  },
  example_angular: {
    js: require('./example_angular'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_angular.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_angular12.xliff')).toString())
  },
  example_google: {
    js: require('./example_google_action'),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_google_action.xliff')).toString())
  },
  example_groups: {
    js: require('./example_groups'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_groups.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_groups12.xliff')).toString())
  },
  example_cdata: {
    js: require('./example_cdata'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_cdata.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_cdata12.xliff')).toString())
  },
  example_comments: {
    js: require('./example_comments'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_comments.xliff')).toString())
  },
  example_ignorable: {
    js: require('./example_ignorable'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_ignorable.xliff')).toString())
  }
}
