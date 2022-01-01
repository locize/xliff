export default function ofjs (js, what, options, cb) {
  const res = {}

  const nsKeys = Object.keys(js.resources || {})
  if (nsKeys.length === 1) {
    const ns = js.resources[nsKeys[0]]
    const keys = Object.keys(ns)
    keys.forEach((key) => {
      const value = getSegment(ns[key], what, options)
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
      const value = getSegment(ns[key], what, options)
      if (value === undefined) return
      res[nsKey][key] = value
    })
  })
  if (cb) return cb(null, res)
  return res
}

function getSegment(category, what, options) {
  const value = category[what]
  if (value === undefined && category.groupUnits && options.includeGroups) {
    const group = {}
    const groupKeys = Object.keys(category.groupUnits)
    groupKeys.forEach(groupKey => {
      group[groupKey] = category.groupUnits[groupKey][what]
    })
    return group
  } else {
    return value
  }
}
