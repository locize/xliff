module.exports = exports = function makeInlineElement(type, id, attributes, contents) {
  const contentsObj = contents !== undefined ? { contents } : {};
  const dataObj = Object.assign({}, attributes, { id }, contentsObj);
  return { [type]: dataObj };
};
