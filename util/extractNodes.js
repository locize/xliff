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

  // nested placeholder tag
  if (valueElement.type === 'element' && valueElement.name === 'ph') {
    return {
      ph: {
        id: valueElement.attributes.id,
        ctype: valueElement.attributes.ctype,
        content: extractValue(valueElement.elements),
      }
    };
  }

  // just ignore anything else
  return '';
}
exports.extractValue = extractValue;
