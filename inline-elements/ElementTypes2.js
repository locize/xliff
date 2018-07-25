const ElementTypes = require('./ElementTypes');
const makeInlineElement = require('./makeInlineElement');

const ElementTypes2 = {
  elementTypeToTagMap: {
    [ElementTypes.Standalone]: 'ph',
    [ElementTypes.GenericSpan]: 'pc',
    [ElementTypes.GenericSpanStart]: 'sc',
    [ElementTypes.GenericSpanEnd]: 'ec',
    [ElementTypes.Span]: 'pc',
    [ElementTypes.SpanStart]: 'sc',
    [ElementTypes.SpanEnd]: 'ec',
  },
  tagToElementTypeMap: {
    ['ph']: ElementTypes.Standalone,
    ['pc']: ElementTypes.Span,
    ['sc']: ElementTypes.SpanStart,
    ['ec']: ElementTypes.SpanEnd,
  },
  factories: {
    [ElementTypes.Standalone]: (type, id, attributes) => makeInlineElement(ElementTypes.Standalone, id, attributes),
    [ElementTypes.GenericSpan]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.GenericSpan, id, attributes, contents),
    [ElementTypes.GenericSpanStart]: (type, id, attributes) => makeInlineElement(ElementTypes.GenericSpanStart, id, attributes),
    [ElementTypes.GenericSpanEnd]: (type, id, attributes) => makeInlineElement(ElementTypes.GenericSpanEnd, id, attributes),
    [ElementTypes.Span]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.Span, id, attributes, contents),
    [ElementTypes.SpanStart]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.SpanStart, id, attributes, contents),
    [ElementTypes.SpanEnd]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.SpanEnd, id, attributes, contents),
  }
};
module.exports = exports = ElementTypes2;
