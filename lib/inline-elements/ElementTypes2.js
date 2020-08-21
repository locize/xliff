import ElementTypes from './ElementTypes.js'
import makeInlineElement from './makeInlineElement.js'

export default {
  elementTypeToTagMap: {
    [ElementTypes.Standalone]: 'ph',
    [ElementTypes.GenericSpan]: 'pc',
    [ElementTypes.GenericSpanStart]: 'sc',
    [ElementTypes.GenericSpanEnd]: 'ec',
    [ElementTypes.Span]: 'pc',
    [ElementTypes.SpanStart]: 'sc',
    [ElementTypes.SpanEnd]: 'ec'
  },
  tagToElementTypeMap: {
    ph: ElementTypes.Standalone,
    pc: ElementTypes.Span,
    sc: ElementTypes.SpanStart,
    ec: ElementTypes.SpanEnd
  },
  factories: {
    [ElementTypes.Standalone]: (attributes) => makeInlineElement(ElementTypes.Standalone, attributes),
    [ElementTypes.GenericSpan]: (attributes, contents) => makeInlineElement(ElementTypes.GenericSpan, attributes, contents),
    [ElementTypes.GenericSpanStart]: (attributes) => makeInlineElement(ElementTypes.GenericSpanStart, attributes),
    [ElementTypes.GenericSpanEnd]: (attributes) => makeInlineElement(ElementTypes.GenericSpanEnd, attributes),
    [ElementTypes.Span]: (attributes, contents) => makeInlineElement(ElementTypes.Span, attributes, contents),
    [ElementTypes.SpanStart]: (attributes, contents) => makeInlineElement(ElementTypes.SpanStart, attributes, contents),
    [ElementTypes.SpanEnd]: (attributes, contents) => makeInlineElement(ElementTypes.SpanEnd, attributes, contents)
  }
}
