const makeInlineElement = require('./makeInlineElement');

const ElementTypes = {
  Standalone: 'Standalone',
  GenericSpan: 'GenericSpan',
  GenericSpanStart: 'GenericSpanStart',
  GenericSpanEnd: 'GenericSpanEnd',
  Span: 'Span',
  SpanStart: 'SpanStart',
  SpanEnd: 'SpanEnd',
};
exports.ElementTypes = ElementTypes;

const elementTypeToTagMap12 = {
  [ElementTypes.Standalone]: 'x',
  [ElementTypes.GenericSpan]: 'g',
  [ElementTypes.GenericSpanStart]: 'bx',
  [ElementTypes.GenericSpanEnd]: 'ex',
  [ElementTypes.Span]: 'ph',
  [ElementTypes.SpanStart]: 'bpt',
  [ElementTypes.SpanEnd]: 'ept',
};

const tagToElementTypeMap12 = {
  ['x']: ElementTypes.Standalone,
  ['g']: ElementTypes.GenericSpan,
  ['bx']: ElementTypes.GenericSpanStart,
  ['ex']: ElementTypes.GenericSpanEnd,
  ['ph']: ElementTypes.Span,
  ['bpt']: ElementTypes.SpanStart,
  ['ept']: ElementTypes.SpanEnd,
};

function elementTypeToTag(type) {
  return elementTypeToTagMap12[type];
}
exports.elementTypeToTag = elementTypeToTag;

function tagToElementType(tagName) {
  return tagToElementTypeMap12[tagName];
}
exports.tagToElementType = tagToElementType;

const elementTypeFactories12 = {
  [ElementTypes.Standalone]: (type, id, attributes) => makeInlineElement(ElementTypes.Standalone, id, attributes),
  [ElementTypes.GenericSpan]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.GenericSpan, id, attributes, contents),
  [ElementTypes.GenericSpanStart]: (type, id, attributes) => makeInlineElement(ElementTypes.GenericSpanStart, id, attributes),
  [ElementTypes.GenericSpanEnd]: (type, id, attributes) => makeInlineElement(ElementTypes.GenericSpanEnd, id, attributes),
  [ElementTypes.Span]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.Span, id, attributes, contents),
  [ElementTypes.SpanStart]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.SpanStart, id, attributes, contents),
  [ElementTypes.SpanEnd]: (type, id, attributes, contents) => makeInlineElement(ElementTypes.SpanEnd, id, attributes, contents),
};
exports.elementTypeFactories12 = elementTypeFactories12;
