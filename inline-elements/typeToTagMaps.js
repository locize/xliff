function elementTypeToTag(type, types) {
  return types.elementTypeToTagMap[type];
}
exports.elementTypeToTag = elementTypeToTag;

function tagToElementType(tagName, types) {
  return types.tagToElementTypeMap[tagName];
}
exports.tagToElementType = tagToElementType;
