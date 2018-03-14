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
