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
    spaces: opt.indent !== undefined ? opt.indent : '  '
  }

  const rootAttributes = {
    xmlns: 'urn:oasis:names:tc:xliff:document:2.0',
    version: '2.0',
    srcLang: obj.sourceLanguage,
    trgLang: obj.targetLanguage
  }
  const root = makeElement('xliff', rootAttributes, true)

  Object.keys(obj.resources).forEach((nsName) => {
    const fileChildren = createUnitTags(obj.resources[nsName])
    const f = makeElement('file', { id: nsName }, fileChildren)
    root.elements.push(f)
  })

  const xmlJs = {
    elements: [root]
  }

  const xml = convert.js2xml(xmlJs, options)
  if (cb) cb(null, xml)
  return xml
}

function createUnitTags (unitElements) {
  return Object.keys(unitElements).map((key) => {
    if (unitElements[key].groupUnits) {
      return createGroupUnitTag(key, unitElements[key])
    } else {
      return createUnitTag(key, unitElements[key])
    }
  })
}

function createGroupUnitTag (id, group) {
  const additionalAttributes = group.additionalAttributes != null ? group.additionalAttributes : {}
  const groupUnits = createUnitTags(group.groupUnits)
  return makeElement('group', Object.assign({ id: escape(id) }, additionalAttributes), groupUnits)
}

function createUnitTag (id, unit) {
  const segment = makeElement('segment', null, true)
  if (!unit.source && unit.target) unit.source = ''
  if (unit.source) segment.elements.push(makeElement('source', null, makeValue(unit.source, ElementTypes2)))
  if (unit.target !== undefined) segment.elements.push(makeElement('target', null, makeValue(unit.target, ElementTypes2)))
  const subEle = [segment]
  if ('note' in unit) {
    const noteElms = []
    createNoteObjects(unit.note).forEach(noteObj => {
      noteElms.push(makeElement('note', null, [noteObj]))
    })
    subEle.unshift(makeElement('notes', null, noteElms))
  }
  const additionalAttributes = unit.additionalAttributes != null ? unit.additionalAttributes : {}
  return makeElement('unit', Object.assign({ id: escape(id) }, additionalAttributes), subEle)
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
