const ElementTypes12 = require('../inline-elements/ElementTypes').ElementTypes12;
const tagToElementType = require('../inline-elements/ElementTypes').tagToElementType;

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
  const elementType = tagToElementType(valueElement.name, ElementTypes12);
  if (valueElement.type === 'element' && elementType !== undefined) {
    const inlineElementFactory = ElementTypes12.factories[elementType];
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
