import convert from 'xml-js'
import ElementTypes from './ElementTypes.js'
import makeInlineElement from './makeInlineElement.js'

// how each known tag (union of the 1.2 and 2.x vocabularies) maps back to an
// element type on unflatten; contents: true mirrors the parse factories that
// always receive a contents value ('' when the tag is empty)
const TAG_INFO = {
  x: { type: ElementTypes.Standalone, contents: false },
  g: { type: ElementTypes.GenericSpan, contents: true },
  bx: { type: ElementTypes.GenericSpanStart, contents: false },
  ex: { type: ElementTypes.GenericSpanEnd, contents: false },
  bpt: { type: ElementTypes.SpanStart, contents: true },
  ept: { type: ElementTypes.SpanEnd, contents: true },
  mrk: { type: ElementTypes.Marker, contents: true },
  pc: { type: ElementTypes.Span, contents: true },
  sc: { type: ElementTypes.SpanStart, contents: true },
  ec: { type: ElementTypes.SpanEnd, contents: true }
  // ph is special-cased: paired => Span (1.2), self-closing => Standalone (2.x)
}

const SELECTORS = ['plural', 'gender', 'select']

const TOKEN_PATTERN = new RegExp('<(' + Object.keys(TAG_INFO).concat(['ph']).concat(SELECTORS).join('|') + ')(\\s[^<>]*)?/?>')

// only & and < are ambiguous in text; a bare > is valid XML and stays readable
function escapeText (str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

function escapeAttr (str) {
  return escapeText(str).replace(/"/g, '&quot;')
}

// id first, then equiv-text, then the rest alphabetical, so flattened strings are byte-stable
function attrString (attrs) {
  const rank = (k) => k === 'id' ? 0 : k === 'equiv-text' ? 1 : 2
  return Object.keys(attrs)
    .filter((k) => attrs[k] !== undefined && attrs[k] !== null)
    .sort((a, b) => (rank(a) - rank(b)) || (a < b ? -1 : a > b ? 1 : 0))
    .map((k) => ' ' + k + '="' + escapeAttr(attrs[k]) + '"')
    .join('')
}

function flattenSegment (segment, elementTypeInfo) {
  if (typeof segment === 'string' || segment instanceof String) return escapeText(segment)

  // plural/gender/select (XLIFF 2.2) shape: { type, id, var, options, otherAttrs }
  if (SELECTORS.includes(segment.type)) {
    const attrs = Object.assign({ id: segment.id, var: segment.var }, segment.otherAttrs)
    const options = (segment.options || []).map((opt) =>
      '<option key="' + escapeAttr(opt.key) + '">' + flattenInline(opt.source, elementTypeInfo, true) + '</option>'
    ).join('')
    return '<' + segment.type + attrString(attrs) + '>' + options + '</' + segment.type + '>'
  }

  const elementType = Object.keys(segment)[0]
  const tag = elementTypeInfo.elementTypeToTagMap[elementType]
  if (tag === undefined) return '' // unknown segment: same "ignore" semantics as the XML serializer

  const elementObj = segment[elementType]
  const attrs = Object.assign({}, elementObj)
  delete attrs.contents
  const contents = elementObj.contents
  if (contents === undefined || contents === '') {
    return '<' + tag + attrString(attrs) + '/>'
  }
  return '<' + tag + attrString(attrs) + '>' + flattenInline(contents, elementTypeInfo, true) + '</' + tag + '>'
}

export function flattenInline (value, elementTypeInfo, insideElement) {
  if (typeof value === 'string' || value instanceof String) {
    return insideElement ? escapeText(value) : String(value)
  }
  if (Array.isArray(value)) return value.map((segment) => flattenSegment(segment, elementTypeInfo)).join('')
  if (value === undefined || value === null) return value
  return flattenSegment(value, elementTypeInfo)
}

function unflattenElement (el) {
  if (el.type === 'text') return el.text
  if (el.type !== 'element') return ''

  if (SELECTORS.includes(el.name)) {
    const attributes = el.attributes || {}
    const options = (el.elements || []).filter((e) => e.name === 'option').map((opt) => ({
      key: opt.attributes && opt.attributes.key,
      source: unflattenElements(opt.elements)
    }))
    return {
      type: el.name,
      id: attributes.id,
      var: attributes.var,
      options,
      otherAttrs: Object.fromEntries(Object.entries(attributes).filter(([k]) => !['id', 'var'].includes(k)))
    }
  }

  const paired = Array.isArray(el.elements) && el.elements.length > 0
  let info = TAG_INFO[el.name]
  if (el.name === 'ph') {
    info = paired ? { type: ElementTypes.Span, contents: true } : { type: ElementTypes.Standalone, contents: false }
  }
  if (info === undefined) throw new Error('unknown tag: ' + el.name)

  const attrs = Object.assign({}, el.attributes)
  if (!info.contents) return makeInlineElement(info.type, attrs)
  return makeInlineElement(info.type, attrs, unflattenElements(el.elements))
}

function unflattenElements (elements) {
  if (!Array.isArray(elements) || elements.length === 0) return ''
  const segments = elements.map(unflattenElement)
  return segments.length === 1 ? segments[0] : segments
}

export function unflattenInline (str) {
  if (typeof str !== 'string' && !(str instanceof String)) return str
  if (!TOKEN_PATTERN.test(str)) return str

  let parsed
  try {
    parsed = convert.xml2js('<v>' + str + '</v>', { captureSpacesBetweenElements: true })
  } catch (err) {
    return str // not well-formed: leave the string untouched, never guess
  }

  try {
    return unflattenElements(parsed.elements[0].elements)
  } catch (err) {
    return str // contains unrecognized tags: leave the string untouched
  }
}

export default { flattenInline, unflattenInline }
