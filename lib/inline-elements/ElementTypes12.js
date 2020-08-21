import ElementTypes from './ElementTypes.js'
import makeInlineElement from './makeInlineElement.js'

export default {
  elementTypeToTagMap: {
    [ElementTypes.Standalone]: 'x',
    [ElementTypes.GenericSpan]: 'g',
    [ElementTypes.GenericSpanStart]: 'bx',
    [ElementTypes.GenericSpanEnd]: 'ex',
    [ElementTypes.Span]: 'ph',
    [ElementTypes.SpanStart]: 'bpt',
    [ElementTypes.SpanEnd]: 'ept',
    [ElementTypes.Marker]: 'mrk'
  },
  tagToElementTypeMap: {
    x: ElementTypes.Standalone,
    g: ElementTypes.GenericSpan,
    bx: ElementTypes.GenericSpanStart,
    ex: ElementTypes.GenericSpanEnd,
    ph: ElementTypes.Span,
    bpt: ElementTypes.SpanStart,
    ept: ElementTypes.SpanEnd,
    mrk: ElementTypes.Marker
  },
  factories: {
    [ElementTypes.Standalone]: (attributes) => makeInlineElement(ElementTypes.Standalone, attributes),
    [ElementTypes.GenericSpan]: (attributes, contents) => makeInlineElement(ElementTypes.GenericSpan, attributes, contents),
    [ElementTypes.GenericSpanStart]: (attributes) => makeInlineElement(ElementTypes.GenericSpanStart, attributes),
    [ElementTypes.GenericSpanEnd]: (attributes) => makeInlineElement(ElementTypes.GenericSpanEnd, attributes),
    [ElementTypes.Span]: (attributes, contents) => makeInlineElement(ElementTypes.Span, attributes, contents),
    [ElementTypes.SpanStart]: (attributes, contents) => makeInlineElement(ElementTypes.SpanStart, attributes, contents),
    [ElementTypes.SpanEnd]: (attributes, contents) => makeInlineElement(ElementTypes.SpanEnd, attributes, contents),
    [ElementTypes.Marker]: (attributes, contents) => makeInlineElement(ElementTypes.Marker, attributes, contents)
  }
}
