import convert from 'xml-js'
import ElementTypes2 from './inline-elements/ElementTypes2.js'
import { makeElement, makeText, makeValue } from './xml-js/objectToXml.js'

import escape from './util/escape.js'

const js2xliffClb = (obj, opt, cb) => {
  if (!cb && typeof opt === 'function') {
    cb = opt
    opt = { indent: '  ' }
  }
  opt = opt || { indent: '  ' }

  const options = {
    spaces: opt.indent || '  '
  }

  const rootAttributes = {
    xmlns: 'urn:oasis:names:tc:xliff:document:2.0',
    version: '2.0',
    srcLang: obj.sourceLanguage,
    trgLang: obj.targetLanguage
  }
  const root = makeElement('xliff', rootAttributes, true)

  Object.keys(obj.resources).forEach((nsName) => {
    const f = makeElement('file', { id: nsName }, true)
    root.elements.push(f)

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const segment = makeElement('segment', null, true)
      segment.elements.push(makeElement('source', null, makeValue(obj.resources[nsName][k].source, ElementTypes2)))
      segment.elements.push(makeElement('target', null, makeValue(obj.resources[nsName][k].target, ElementTypes2)))
      if ('note' in obj.resources[nsName][k]) {
        segment.elements.push(makeElement('note', null, [makeText(obj.resources[nsName][k].note)]))
      }
      const additionalAttributes = obj.resources[nsName][k].additionalAttributes != null ? obj.resources[nsName][k].additionalAttributes : {}
      const u = makeElement('unit', Object.assign({ id: escape(k) }, additionalAttributes), [segment])
      f.elements.push(u)
    })
  })

  const xmlJs = {
    elements: [root]
  }

  const xml = convert.js2xml(xmlJs, options)
  if (cb) cb(null, xml)
  return xml
}

const js2xliff = (obj, opt, cb) => {
  if (!cb && opt === undefined) {
    return new Promise((resolve, reject) => js2xliffClb(obj, opt, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof opt !== 'function') {
    return new Promise((resolve, reject) => js2xliffClb(obj, opt, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return js2xliffClb(obj, opt, cb)
}

js2xliff.js2xliffClb = js2xliffClb

export default js2xliff
