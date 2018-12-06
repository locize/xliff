const tagToElementType = require('../inline-elements/typeToTagMaps').tagToElementType;

function extractValue(valueElements, elementTypeInfo) {
  if (valueElements === undefined || valueElements === null || valueElements === '') {
    return '';
  }

  if (Array.isArray(valueElements) && valueElements.length > 1) {
    return valueElements.map((valueElement) => extractValue(valueElement, elementTypeInfo));
  }

  const valueElement = Array.isArray(valueElements) ? valueElements[0] || '' : valueElements;

  // text node
  if (valueElement.type === 'text') {
    if (/\n\s*$/.test(valueElement.text)) {
      return valueElement.text.substr(0, valueElement.text.lastIndexOf('\n'));
    }
    return valueElement.text;
  }

  // nested inline element tag
  const elementType = tagToElementType(valueElement.name, elementTypeInfo);
  if (valueElement.type === 'element' && elementType !== undefined) {
    const inlineElementFactory = elementTypeInfo.factories[elementType];
    return inlineElementFactory(
      valueElement.name,
      valueElement.attributes.id,
      valueElement.attributes,
      extractValue(valueElement.elements, elementTypeInfo)
    );
  }

  // just ignore anything else
  return '';
}
exports.extractValue = extractValue;
