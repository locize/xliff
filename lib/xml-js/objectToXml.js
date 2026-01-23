import { elementTypeToTag } from '../inline-elements/typeToTagMaps.js'

export function makeElement (name, attributes, elements) {
  const el = {
    type: 'element',
    name
  }
  if (attributes !== null && attributes !== undefined) {
    el.attributes = attributes
  }
  if (Array.isArray(elements)) {
    el.elements = elements
  } else if (elements === true) {
    el.elements = []
  }
  return el
}

export function makeText (text) {
  return {
    type: 'text',
    text
  }
}

export function makeValue (content, elementTypeInfo, targetXliffVersion) {
  targetXliffVersion = targetXliffVersion || '2.0'
  if (!Array.isArray(content)) {
    if (typeof content === 'string' || content instanceof String) {
      return [makeText(content)]
    }
    // for single object
    let elementType = Object.keys(content)[0]
    let elementObj = content[elementType]
    // handle { type: 'plural', ... } style
    if (elementType === 'type' && ['plural', 'gender', 'select'].includes(content.type)) {
      elementType = content.type.charAt(0).toUpperCase() + content.type.slice(1)
      elementObj = content
    }
    const elementTag = elementTypeToTag(elementType, elementTypeInfo)

    // Only emit plural/gender/select for 2.2
    if (['Plural', 'Gender', 'Select'].includes(elementType) && targetXliffVersion !== '2.2') {
      // fallback: flatten to plain text
      let text = ''
      if (Array.isArray(elementObj.options)) {
        text = elementObj.options.map(opt => opt.source).join(' ')
      } else if (elementObj.contents) {
        text = elementObj.contents
      }
      return [makeText(text)]
    }

    if (elementTag !== undefined) {
      // Special handling for plural/gender/select in 2.2: emit <option> children
      if (['Plural', 'Gender', 'Select'].includes(elementType) && targetXliffVersion === '2.2') {
        const attrs = {
          id: elementObj.id,
          var: elementObj.var
        }
        // Add any other attributes except options
        if (elementObj.otherAttrs) {
          Object.keys(elementObj.otherAttrs).forEach((k) => {
            attrs[k] = elementObj.otherAttrs[k]
          })
        }
        // Emit <option> children
        const optionElements = Array.isArray(elementObj.options)
          ? elementObj.options.map(opt => makeElement('option', { key: opt.key }, [makeText(opt.source)]))
          : []
        return [makeElement(elementTag, attrs, optionElements)]
      }
      // Default: inline element
      const attrsSrc = Object.assign({}, elementObj)
      delete attrsSrc.id
      delete attrsSrc.contents
      // eslint-disable-next-line no-prototype-builtins
      const contents = elementObj.hasOwnProperty('contents') ? makeValue(elementObj.contents, elementTypeInfo, targetXliffVersion) : undefined
      const attrs = {
        id: elementObj.id
      }
      Object.keys(attrsSrc).forEach((attrKey) => {
        if (attrsSrc[attrKey] !== undefined && attrsSrc[attrKey] !== null) {
          attrs[attrKey] = attrsSrc[attrKey] + ''
        }
      })
      return [makeElement(elementTag, attrs, contents)]
    }

    // Fallback for unknown object input: emit XML comment
    return [{ type: 'comment', comment: 'Warning: unknown inline element was ignored' }]
  }

  return content.map((segment) => {
    if (segment === undefined || segment === null) return makeText('')
    if (typeof segment !== 'object') return makeText(String(segment))
    // existing logic for strings and objects...
    if (typeof segment === 'string' || segment instanceof String) {
      return makeText(segment)
    }
    // Inline elements or plural/gender/select
    let elementType = Object.keys(segment)[0]
    let elementObj = segment[elementType]
    // handle { type: 'plural', ... } style
    if (elementType === 'type' && ['plural', 'gender', 'select'].includes(segment.type)) {
      elementType = segment.type.charAt(0).toUpperCase() + segment.type.slice(1)
      elementObj = segment
    }
    const elementTag = elementTypeToTag(elementType, elementTypeInfo)
    if (['Plural', 'Gender', 'Select'].includes(elementType) && targetXliffVersion !== '2.2') {
      // fallback: flatten to plain text
      let text = ''
      if (Array.isArray(elementObj.options)) {
        text = elementObj.options.map(opt => opt.source).join(' ')
      } else if (elementObj.contents) {
        text = elementObj.contents
      }
      return makeText(text)
    }
    if (elementTag !== undefined) {
      const attrsSrc = Object.assign({}, elementObj)
      delete attrsSrc.id
      delete attrsSrc.contents
      // eslint-disable-next-line no-prototype-builtins
      const contents = elementObj.hasOwnProperty('contents') ? makeValue(elementObj.contents, elementTypeInfo, targetXliffVersion) : undefined
      const attrs = {
        id: elementObj.id
      }
      Object.keys(attrsSrc).forEach((attrKey) => {
        const v = attrsSrc[attrKey]
        if (v !== undefined && v !== null) {
          attrs[attrKey] = v + ''
        }
      })
      return makeElement(elementTag, attrs, contents)
    }
    // If an invalid object is included as a segment in a source/target value array,
    // just turn it into an XML comment
    const segmentString =
      '{ ' +
      Object.keys(segment).reduce((result, segmentKey) => {
        return result + segmentKey + ': "' + segment[segmentKey].toString() + '"'
      }, '') +
      ' }'
    return { type: 'comment', comment: 'Warning: unexpected segment ' + segmentString + ' was ignored' }
  })
}
