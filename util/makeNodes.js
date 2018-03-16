function makeElement(name, attributes, elements) {
  const el = {
    type: 'element',
    name: name
  };
  if (attributes !== null && attributes !== undefined) {
    el.attributes = attributes;
  }
  if (Array.isArray(elements)) {
    el.elements = elements;
  } else if (elements === true) {
    el.elements = [];
  }
  return el;
}
exports.makeElement = makeElement;

function makeText(text) {
  return {
    type: 'text',
    text
  };
}
exports.makeText = makeText;

function makeValue(content) {
  if (!Array.isArray(content)) {
    return [makeText(content)];
  }

  return content.map((segment) => {
    if (typeof segment === 'string' || segment instanceof String) {
      return makeText(segment);
    } else if ('ph' in segment) {
      const phAttrs = ['id', 'ctype'].reduce((result, key) => {
        if (segment.ph[key] !== undefined) { result[key] = segment.ph[key]; }
        return result;
      }, {});
      return makeElement('ph', phAttrs, [makeText(segment.ph.content)]);
    }
  });
}
exports.makeValue = makeValue;
