import convert from 'xml-js'
import ElementTypes2 from './inline-elements/ElementTypes2.js'
import { makeElement, makeText, makeValue } from './xml-js/objectToXml.js'
import { unflattenInline } from './inline-elements/flatten.js'

import escape from './util/escape.js'

const js2xliffClb = (obj, opt, cb) => {
  if (!cb && typeof opt === 'function') {
    cb = opt
    opt = { indent: '  ' }
  }
  opt = opt || { indent: '  ' }
  const targetXliffVersion = opt.targetXliffVersion || '2.0'
  const options = {
    spaces: opt.indent !== undefined ? opt.indent : '  ',
    targetXliffVersion,
    inlineAsString: !!opt.inlineAsString
  }

  // XLIFF 2.1 keeps the 2.0 core namespace (only the version attribute changes);
  // 2.0 and 2.2 each have their own namespace per the OASIS specs
  const xmlnsVersion = targetXliffVersion === '2.1' ? '2.0' : targetXliffVersion
  const rootAttributes = {
    xmlns: 'urn:oasis:names:tc:xliff:document:' + xmlnsVersion,
    version: targetXliffVersion,
    srcLang: obj.sourceLanguage,
    trgLang: obj.targetLanguage
  }

  const hasSizeRestriction = !!Object.keys(obj.resources).find((nsName) => Object.keys(obj.resources[nsName]).find((k) => obj.resources[nsName][k].additionalAttributes && (obj.resources[nsName][k].additionalAttributes.sizeRestriction !== undefined || obj.resources[nsName][k].additionalAttributes['slr:sizeRestriction'] !== undefined)))
  if (hasSizeRestriction) rootAttributes['xmlns:slr'] = 'urn:oasis:names:tc:xliff:sizerestriction:2.0'

  const root = makeElement('xliff', rootAttributes, true)

  // Insert headerExtras before <file> elements for round-trip preservation
  if (Array.isArray(obj.headerExtras) && obj.headerExtras.length) {
    obj.headerExtras.forEach(extra => {
      const clone = JSON.parse(JSON.stringify(extra))
      if (clone.type === 'element' && clone.attributes == null) {
        clone.attributes = {}
      }
      root.elements.push(clone)
    })
  }

  Object.keys(obj.resources).forEach((nsName) => {
    const fileChildren = createUnitTags(obj.resources[nsName], options)
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

function createUnitTags (unitElements, options) {
  const hasSizeRestriction = !!Object.keys(unitElements).find((k) => unitElements[k].additionalAttributes && (unitElements[k].additionalAttributes.sizeRestriction !== undefined || unitElements[k].additionalAttributes['slr:sizeRestriction'] !== undefined))
  const preElements = []
  if (hasSizeRestriction) {
    preElements.push({
      type: 'element',
      name: 'slr:profiles',
      attributes: { generalProfile: 'xliff:codepoints', storageProfile: 'xliff:utf8' },
      elements: [{
        type: 'element',
        name: 'slr:normalization',
        attributes: { general: 'nfc', storage: 'nfc' }
      }]
    })
  }
  return preElements.concat(Object.keys(unitElements).map((key) => {
    if (unitElements[key].groupUnits) {
      return createGroupUnitTag(key, unitElements[key], options)
    } else {
      return createUnitTag(key, unitElements[key], options)
    }
  }))
}

function createGroupUnitTag (id, group, options) {
  const additionalAttributes = group.additionalAttributes != null ? group.additionalAttributes : {}
  const groupUnits = createUnitTags(group.groupUnits, options)
  const attrs = { id: escape(id) }
  Object.keys(additionalAttributes).forEach(k => {
    const v = additionalAttributes[k]
    if (v !== undefined && v !== null) attrs[k] = String(v)
  })
  return makeElement('group', attrs, groupUnits)
}

function createUnitTag (id, unit, options) {
  const segment = makeElement('segment', null, true)
  let srcVal = (unit.source === undefined && unit.target !== undefined) ? '' : unit.source
  if (options && options.inlineAsString) srcVal = unflattenInline(srcVal)
  if (srcVal !== undefined) segment.elements.push(makeElement('source', null, makeValue(srcVal, ElementTypes2, options && options.targetXliffVersion)))
  if (unit.target !== undefined) segment.elements.push(makeElement('target', null, makeValue(options && options.inlineAsString ? unflattenInline(unit.target) : unit.target, ElementTypes2, options && options.targetXliffVersion)))
  const subEle = [segment]
  if ('note' in unit) {
    const noteElms = []
    createNoteObjects(unit.note).forEach(noteObj => {
      noteElms.push(makeElement('note', null, [noteObj]))
    })
    subEle.unshift(makeElement('notes', null, noteElms))
  }
  const additionalAttributes = unit.additionalAttributes != null ? { ...unit.additionalAttributes } : {}
  if (additionalAttributes.sizeRestriction) {
    additionalAttributes['slr:sizeRestriction'] = additionalAttributes.sizeRestriction + ''
    delete additionalAttributes.sizeRestriction
  }
  const attrs = { id: escape(id) }
  Object.keys(additionalAttributes).forEach(k => {
    const v = additionalAttributes[k]
    if (v !== undefined && v !== null) attrs[k] = String(v)
  })
  return makeElement('unit', attrs, subEle)
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
