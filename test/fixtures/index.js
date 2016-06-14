const fs = require('fs');
const path = require('path');

module.exports = {
  example: {
    js: require('./example.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example.xliff')).toString().replace(/\n$/, ''),
    js_source: require('./example_source.json'),
    js_target: require('./example_target.json')
  },
  example_multi: {
    js: require('./example_multi.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_multi.xliff')).toString().replace(/\n$/, ''),
    js_source: require('./example_multi_source.json'),
    js_target: require('./example_multi_target.json')
  }
};
