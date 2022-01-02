export default function ofjs (js, what, cb) {
  const res = {}

  const nsKeys = Object.keys(js.resources || {})
  if (nsKeys.length === 1) {
    const ns = js.resources[nsKeys[0]]
    const keys = Object.keys(ns)
    keys.forEach((key) => {
      const value = getSegment(ns[key], what)
      if (value === undefined) return
      res[key] = value
    })
    if (cb) return cb(null, res)
    return res
  }

  nsKeys.forEach((nsKey) => {
    res[nsKey] = {}

    const ns = js.resources[nsKey]
    const keys = Object.keys(ns)
    keys.forEach((key) => {
      const value = getSegment(ns[key], what)
      if (value !== undefined) res[nsKey][key] = value
    })
  })
  if (cb) return cb(null, res)
  return res
}

function getSegment (category, what) {
  let value = category[what]
  if (value === undefined && category.groupUnits) {
    value = {}
    const groupKeys = Object.keys(category.groupUnits)
    groupKeys.forEach(groupKey => {
      const groupValue = getSegment(category.groupUnits[groupKey], what)
      if (groupValue !== undefined) value[groupKey] = groupValue
    })
  }
  return value
}
