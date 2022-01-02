import convert from 'xml-js'
import ElementTypes12 from './inline-elements/ElementTypes12.js'
import { makeElement, makeText, makeValue } from './xml-js/objectToXml.js'

import escape from './util/escape.js'

const jsToXliff12Clb = (obj, opt, cb) => {
  if (!cb && typeof opt === 'function') {
    cb = opt
    opt = { indent: '  ' }
  }
  opt = opt || { indent: '  ' }

  const options = {
    spaces: opt.indent !== undefined ? opt.indent : '  ',
    xmlLangAttr: !!opt.xmlLangAttr
  }

  const rootAttributes = {
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xsi:schemaLocation': 'urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd',
    xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
    version: '1.2'
  }
  const root = makeElement('xliff', rootAttributes, true)

  Object.keys(obj.resources).forEach((nsName) => {
    const bodyChildren = createUnitTags(obj.resources[nsName], obj, options)

    const b = makeElement('body', null, bodyChildren)
    const fileAttributes = {
      original: nsName,
      datatype: 'plaintext',
      'source-language': obj.sourceLanguage
    }
    if (obj.targetLanguage != null) {
      fileAttributes['target-language'] = obj.targetLanguage
    }
    const f = makeElement('file', fileAttributes, [b])
    root.elements.push(f)
  })

  const xmlJs = {
    elements: [root]
  }

  const xml = convert.js2xml(xmlJs, options)
  if (cb) cb(null, xml)
  return xml
}

function createUnitTags (unitElements, obj, options) {
  return Object.keys(unitElements).map((key) => {
    if (unitElements[key].groupUnits) {
      return createGroupUnitTag(key, unitElements[key], obj, options)
    } else {
      return createTransUnitTag(key, unitElements[key], obj, options)
    }
  })
}

function createGroupUnitTag (key, resource, obj, options) {
  const additionalAttributes = resource.additionalAttributes != null ? resource.additionalAttributes : {}
  const groupUnits = createUnitTags(resource.groupUnits, obj, options)
  return makeElement('group', Object.assign({ id: escape(key) }, additionalAttributes), groupUnits)
}

function createTransUnitTag (key, resource, obj, options) {
  const additionalAttributes = resource.additionalAttributes != null ? resource.additionalAttributes : {}
  const u = makeElement('trans-unit', Object.assign({ id: escape(key) }, additionalAttributes), true)
  let sourceAttributes = null
  if (options.xmlLangAttr) {
    sourceAttributes = {
      'xml:lang': obj.sourceLanguage
    }
  }
  if (!resource.source && resource.target) resource.source = ''
  if (resource.source) u.elements.push(makeElement('source', sourceAttributes, makeValue(resource.source, ElementTypes12)))
  if (resource.target != null) {
    let targetAttributes = null
    if (options.xmlLangAttr && obj.targetLanguage) {
      targetAttributes = {
        'xml:lang': obj.targetLanguage
      }
    }
    u.elements.push(makeElement('target', targetAttributes, makeValue(resource.target, ElementTypes12)))
  }
  if ('note' in resource) {
    createNoteObjects(resource.note).forEach(noteObj => {
      u.elements.push(makeElement('note', null, [noteObj]))
    })
  }

  return u
}

function createNoteObjects (note) {
  const arrNote = []
  const baseNote = makeText(note)
  if (Array.isArray(baseNote.text)) {
    baseNote.text.forEach(text => {
      arrNote.push({ type: baseNote.type, text })
    })
  } else {
    arrNote.push(baseNote)
  }
  return arrNote
}

const jsToXliff12 = (obj, opt, cb) => {
  if (!cb && opt === undefined) {
    return new Promise((resolve, reject) => jsToXliff12Clb(obj, opt, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  if (!cb && typeof opt !== 'function') {
    return new Promise((resolve, reject) => jsToXliff12Clb(obj, opt, (err, ret) => err ? reject(err) : resolve(ret)))
  }
  return jsToXliff12Clb(obj, opt, cb)
}

jsToXliff12.jsToXliff12Clb = jsToXliff12Clb

export default jsToXliff12
