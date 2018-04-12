const elementTypes12 = require('../inline-elements/ElementTypes').elementTypes12;

function extractValue(valueElements) {
  if (valueElements === undefined || valueElements === null || valueElements === '') {
    return '';
  }

  if (Array.isArray(valueElements) && valueElements.length > 1) {
    return valueElements.map(extractValue);
  }

  const valueElement = Array.isArray(valueElements) ? valueElements[0] || '' : valueElements;

  // text node
  if (valueElement.type === 'text') {
    return valueElement.text.indexOf('\n') === -1 ? valueElement.text : valueElement.text.substr(0, valueElement.text.lastIndexOf('\n'));
  }

  // nested inline element tag
  if (valueElement.type === 'element' && elementTypes12.hasOwnProperty(valueElement.name)) {
    const inlineElementFactory = elementTypes12[valueElement.name];
    return inlineElementFactory(
      valueElement.name,
      valueElement.attributes.id,
      valueElement.attributes,
      extractValue(valueElement.elements)
    );
  }

  // just ignore anything else
  return '';
}
exports.extractValue = extractValue;
