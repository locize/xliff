export function elementTypeToTag (type, types) {
  return types.elementTypeToTagMap[type]
}

export function tagToElementType (tagName, types) {
  return types.tagToElementTypeMap[tagName]
}
