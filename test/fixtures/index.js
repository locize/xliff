const fs = require('fs')
const path = require('path')

module.exports = {
  example: {
    js: require('./example.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff_output_notes: fs.readFileSync(path.join(__dirname, 'example_output_note.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff_compact: fs.readFileSync(path.join(__dirname, 'example_compact.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12_output_notes: fs.readFileSync(path.join(__dirname, 'example12_output_note.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12_compact: fs.readFileSync(path.join(__dirname, 'example_compact12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    js_source: require('./example_source.json'),
    js_target: require('./example_target.json'),
    js_input_notes: require('./example_input_note.json'),
    js_output_notes: require('./example_output_note.json')
  },
  example_source_attr: {
    // The JS should be the same as example.js
    xliff12: fs.readFileSync(path.join(__dirname, 'example_source_attr12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_multi: {
    js: require('./example_multi.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_multi.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_multi12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    js_source: require('./example_multi_source.json'),
    js_target: require('./example_multi_target.json')
  },
  example_note: {
    js: require('./example_note.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_note.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_note12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_additional_attributes: {
    js: require('./example_additional_attributes'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_additional_attributes.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_additional_attributes12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_angular: {
    js: require('./example_angular'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_angular.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_angular12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_google: {
    js: require('./example_google_action'),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_google_action.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_groups: {
    js: require('./example_groups'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_groups.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_groups12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_cdata: {
    js: require('./example_cdata'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_cdata.xliff')).toString().replace(/\n$/, '').replace(/\r$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_cdata12.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_comments: {
    js: require('./example_comments'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_comments.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  },
  example_ignorable: {
    js: require('./example_ignorable'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_ignorable.xliff')).toString().replace(/\n$/, '').replace(/\r$/, '')
  }
}
