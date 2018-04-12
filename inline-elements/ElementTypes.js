const makeInlineElement = require('./makeInlineElement');

const Standalone = 'x';
const GenericSpan = 'g';
const GenericSpanStart = 'bx';
const GenericSpanEnd = 'ex';
const Span = 'ph';
const SpanStart = 'bpt';
const SpanEnd = 'ept';

const elementTypes12 = {
  [Standalone]: (type, id, attributes) => makeInlineElement(Standalone, id, attributes),
  [GenericSpan]: (type, id, attributes, contents) => makeInlineElement(GenericSpan, id, attributes, contents),
  [GenericSpanStart]: (type, id, attributes) => makeInlineElement(GenericSpanStart, id, attributes),
  [GenericSpanEnd]: (type, id, attributes) => makeInlineElement(GenericSpanEnd, id, attributes),
  [Span]: (type, id, attributes, contents) => makeInlineElement(Span, id, attributes, contents),
  [SpanStart]: (type, id, attributes, contents) => makeInlineElement(SpanStart, id, attributes, contents),
  [SpanEnd]: (type, id, attributes, contents) => makeInlineElement(SpanEnd, id, attributes, contents),
};

exports.elementTypes12 = elementTypes12;
