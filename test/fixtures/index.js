const fs = require('fs');
const path = require('path');

module.exports = {
  example: {
    js: require('./example.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example12.xliff')).toString().replace(/\n$/, ''),
    js_source: require('./example_source.json'),
    js_target: require('./example_target.json')
  },
  example_source_attr: {
    // The JS should be the same as example.js
    xliff12: fs.readFileSync(path.join(__dirname, 'example_source_attr12.xliff')).toString().replace(/\n$/, ''),
  },
  example_multi: {
    js: require('./example_multi.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_multi.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_multi12.xliff')).toString().replace(/\n$/, ''),
    js_source: require('./example_multi_source.json'),
    js_target: require('./example_multi_target.json')
  },
  example_note: {
    js: require('./example_note.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_note.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_note12.xliff')).toString().replace(/\n$/, ''),
  },
  example_additional_attributes: {
    js: require('./example_additional_attributes'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_additional_attributes.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_additional_attributes12.xliff')).toString().replace(/\n$/, '')
  }
};
