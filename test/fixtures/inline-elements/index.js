const fs = require('fs');
const path = require('path');

module.exports = {
  example_standalone: {
    js: require('./example_standalone.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_standalone.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_standalone12.xliff')).toString().replace(/\n$/, ''),
  },
  example_genericSpan: {
    js: require('./example_generic-span.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_generic-span.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_generic-span12.xliff')).toString().replace(/\n$/, ''),
    js_source: require('./example_generic-span_source.json'),
    js_target: require('./example_generic-span_target.json')
  },
  example_genericSpanStartEnd: {
    js: require('./example_generic-span-start-end.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_generic-span-start-end.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_generic-span-start-end12.xliff')).toString().replace(/\n$/, ''),
  },
  example_nativeSpan: {
    js: require('./example_native-span.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_native-span.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_native-span12.xliff')).toString().replace(/\n$/, ''),
    js_source: require('./example_native-span_source.json'),
    js_target: require('./example_native-span_target.json')
  },
  example_nativeSpanStartEnd: {
    js: require('./example_native-span-start-end.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_native-span-start-end.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_native-span-start-end12.xliff')).toString().replace(/\n$/, ''),
  },
  example_invalidSegment: {
    js: require('./example_invalid-segment.json'),
    xliff: fs.readFileSync(path.join(__dirname, 'example_invalid-segment.xliff')).toString().replace(/\n$/, ''),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_invalid-segment12.xliff')).toString().replace(/\n$/, ''),
  },
  // Examples showing how this could work with i18next
  example_i18next_nativeSpan: {
    js: require('./example_i18next_native-span.json'),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_i18next_native-span12.xliff')).toString().replace(/\n$/, ''),
  },
  example_i18next_unstructured_nativeSpan: {
    js: require('./example_i18next_unstructured_native-span.json'),
    xliff12: fs.readFileSync(path.join(__dirname, 'example_i18next_unstructured_native-span12.xliff')).toString().replace(/\n$/, ''),
  }
};
