const expect = require('expect.js')
const fixtures = require('./fixtures/inline-elements')
const xliff = require('../')
const ElementTypes12 = require('../cjs/inline-elements/ElementTypes12.js')
const { flattenInline, unflattenInline } = require('../cjs/inline-elements/flatten.js')

const ANGULAR_FLAT_12 = 'Welcome (<x id="INTERPOLATION" equiv-text="{{ count }}"/>)> <x id="ICU" equiv-text="{count, plural, =0 {noone} =1 {number one} other\n    {anyone}}"/>'
const ANGULAR_FLAT_2 = 'Welcome (<ph id="INTERPOLATION" equiv-text="{{ count }}"/>)> <ph id="ICU" equiv-text="{count, plural, =0 {noone} =1 {number one} other\n    {anyone}}"/>'

function eachUnit (resources, fn) {
  Object.keys(resources).forEach((ns) => {
    Object.keys(resources[ns]).forEach((key) => {
      const unit = resources[ns][key]
      if (unit.groupUnits) return eachUnit({ g: unit.groupUnits }, fn)
      fn(unit)
    })
  })
}

describe('inlineAsString option', () => {
  describe('parsing', () => {
    it('xliff12ToJs flattens Angular inline elements to a token string', async () => {
      const res = await xliff.xliff12ToJs(fixtures.example_angular.xliff12, { inlineAsString: true })
      expect(res.resources['ng2.template']['27515543696334242'].source).to.eql(ANGULAR_FLAT_12)
    })

    it('xliff2js flattens Angular inline elements to a token string', async () => {
      const res = await xliff.xliff2js(fixtures.example_angular.xliff, { inlineAsString: true })
      expect(res.resources['ng2.template']['27515543696334242'].source).to.eql(ANGULAR_FLAT_2)
    })

    it('produces only string values for every inline-element fixture', async () => {
      const names = Object.keys(fixtures)
      for (const name of names) {
        if (fixtures[name].xliff12) {
          const res = await xliff.xliff12ToJs(fixtures[name].xliff12, { inlineAsString: true })
          eachUnit(res.resources, (unit) => {
            if (unit.source !== undefined) expect(unit.source).to.be.a('string')
            if (unit.target !== undefined) expect(unit.target).to.be.a('string')
          })
        }
        if (fixtures[name].xliff) {
          const res = await xliff.xliff2js(fixtures[name].xliff, { inlineAsString: true })
          eachUnit(res.resources, (unit) => {
            if (unit.source !== undefined) expect(unit.source).to.be.a('string')
            if (unit.target !== undefined) expect(unit.target).to.be.a('string')
          })
        }
      }
    })
  })

  describe('round-trip', () => {
    it('parse + export with inlineAsString matches the direct path for every fixture', async () => {
      const names = Object.keys(fixtures)
      for (const name of names) {
        if (fixtures[name].xliff12) {
          const direct = await xliff.xliff12ToJs(fixtures[name].xliff12)
          const flat = await xliff.xliff12ToJs(fixtures[name].xliff12, { inlineAsString: true })
          expect(await xliff.jsToXliff12(flat, { inlineAsString: true })).to.eql(await xliff.jsToXliff12(direct))
        }
        if (fixtures[name].xliff) {
          const direct = await xliff.xliff2js(fixtures[name].xliff)
          const flat = await xliff.xliff2js(fixtures[name].xliff, { inlineAsString: true })
          expect(await xliff.js2xliff(flat, { inlineAsString: true })).to.eql(await xliff.js2xliff(direct))
        }
      }
    })

    it('Angular 1.2 file round-trips to the identical export as the array path', async () => {
      const flat = await xliff.xliff12ToJs(fixtures.example_angular.xliff12, { inlineAsString: true })
      expect(await xliff.jsToXliff12(flat, { inlineAsString: true })).to.eql(fixtures.example_angular.xliff12ident)
    })

    it('Angular 2.0 file round-trips byte-identical', async () => {
      const flat = await xliff.xliff2js(fixtures.example_angular.xliff, { inlineAsString: true })
      expect(await xliff.js2xliff(flat, { inlineAsString: true })).to.eql(fixtures.example_angular.xliff)
    })
  })

  describe('unflatten safety', () => {
    it('leaves plain strings without tokens untouched on export', async () => {
      const res = await xliff.jsToXliff12(fixtures.example_i18next_unstructured_nativeSpan.js, { inlineAsString: true })
      expect(res).to.eql(fixtures.example_i18next_unstructured_nativeSpan.xliff12)
    })

    it('leaves strings with unknown tags or broken markup untouched', () => {
      expect(unflattenInline('use <strong>bold</strong> text')).to.eql('use <strong>bold</strong> text')
      expect(unflattenInline('broken <x id="1" & <g>')).to.eql('broken <x id="1" & <g>')
      expect(unflattenInline('a < b and nothing else')).to.eql('a < b and nothing else')
    })

    it('unescapes literal angle brackets and ampersands from flattened text', () => {
      const value = ['a < b & c ', { Standalone: { id: '1' } }]
      const flat = flattenInline(value, ElementTypes12)
      expect(flat).to.eql('a &lt; b &amp; c <x id="1"/>')
      expect(unflattenInline(flat)).to.eql(value)
    })

    it('round-trips nested span elements', () => {
      const value = ['click ', { GenericSpan: { id: '1', contents: ['here <now> ', { Standalone: { id: '2' } }] } }]
      const flat = flattenInline(value, ElementTypes12)
      expect(flat).to.eql('click <g id="1">here &lt;now> <x id="2"/></g>')
      expect(unflattenInline(flat)).to.eql(value)
    })
  })
})
