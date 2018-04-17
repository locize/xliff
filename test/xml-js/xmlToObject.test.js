const expect = require('expect.js');
const ElementTypes = require('../../inline-elements/ElementTypes').ElementTypes;
const elementTypeToTag = require('../../inline-elements/ElementTypes').elementTypeToTag;
const extractValue = require('../../xml-js/xmlToObject').extractValue;

describe('extractValue() converts XML source/target values into xliff.js objects', () => {

  it('returns an empty string for `undefined`, `null`, and `""`', () => {
    expect(extractValue(undefined)).to.eql('');
    expect(extractValue(null)).to.eql('');
    expect(extractValue('')).to.eql('');
  });

  it('turns a text element into a string', () => {
    expect(extractValue({ type: 'text', text: 'Hello' })).to.eql('Hello');
  });

  it('removes trailing line breaks from a "formatted" XML text element', () => {
    expect(extractValue({ type: 'text', text: 'Hello \n' })).to.eql('Hello ');
  });

  it('creates objects for all supported inline element types', () => {
    const supportedElementTypes = Object.keys(ElementTypes);//['x', 'g', 'bx', 'ex', 'ph', 'bpt', 'ept'];
    supportedElementTypes.forEach((expectedType) => {
      expect(extractValue({ type: 'element', name: elementTypeToTag(expectedType), attributes: { id: '1' } })).to.have.property(expectedType);
    });
  });

  it('returns an empty string for an unknown inline element type (or other object', () => {
    expect(extractValue({ type: 'element', name: 'foo', attributes: { id: '1' } })).to.eql('');
  });

  it('turns an array of elements into an array of value segment objects', () => {
    const values = [
      { type: 'text', text: 'Hello '},
      { type: 'text', text: 'World' },
    ];

    expect(extractValue(values)).to.eql(['Hello ', 'World']);
  });

  it('turns an array with only one member into a single value', () => {
    expect(extractValue([{ type: 'text', text: 'Hello' }])).to.eql('Hello');
  });
});
