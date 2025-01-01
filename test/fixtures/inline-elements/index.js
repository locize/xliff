const fs = require('fs')
const path = require('path')
const fixNewLines = require('../fixNewLines')

module.exports = {
  example_codepoint: {
    js: require('./example_codepoint.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_codepoint.xliff')).toString())
  },
  example_codepoint_missing_required_attribute: {
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_codepoint_missing_required_attr.xliff')).toString())
  },
  example_codepoint_with_content: {
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_codepoint_with_content.xliff')).toString())
  },
  example_standalone: {
    js: require('./example_standalone.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_standalone.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_standalone12.xliff')).toString())
  },
  example_standalone_only: {
    js: require('./example_standalone_only.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_standalone_only.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_standalone_only12.xliff')).toString())
  },
  example_genericSpan: {
    js: require('./example_generic-span.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_generic-span.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_generic-span12.xliff')).toString()),
    js_source: require('./example_generic-span_source.json'),
    js_target: require('./example_generic-span_target.json')
  },
  example_genericSpanStartEnd: {
    js: require('./example_generic-span-start-end.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_generic-span-start-end.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_generic-span-start-end12.xliff')).toString())
  },
  example_nativeSpan: {
    js: require('./example_native-span.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_native-span.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_native-span12.xliff')).toString()),
    js_source: require('./example_native-span_source.json'),
    js_target: require('./example_native-span_target.json')
  },
  example_nativeSpanStartEnd: {
    js: require('./example_native-span-start-end.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_native-span-start-end.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_native-span-start-end12.xliff')).toString())
  },
  example_invalidSegment: {
    js: require('./example_invalid-segment.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_invalid-segment.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_invalid-segment12.xliff')).toString())
  },
  // Examples showing how this could work with i18next
  example_i18next_nativeSpan: {
    js: require('./example_i18next_native-span.json'),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_i18next_native-span12.xliff')).toString())
  },
  example_i18next_unstructured_nativeSpan: {
    js: require('./example_i18next_unstructured_native-span.json'),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_i18next_unstructured_native-span12.xliff')).toString())
  },
  example_marker: {
    js: require('./example_marker.json'),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_marker12.xliff')).toString())
  },
  example_markedspan: {
    js: require('./example_markedspan.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_markedspan.xliff')).toString())
  },
  example_markedspanstart: {
    js: require('./example_markedspanstart.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_markedspanstart.xliff')).toString())
  },
  // angular
  example_angular: {
    js: require('./example_angular.json'),
    xliff: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_angular.xliff')).toString()),
    xliff12: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_angular12.xliff')).toString()),
    xliff12ident: fixNewLines(fs.readFileSync(path.join(__dirname, 'example_angular12_ident.xliff')).toString())
  }
}
