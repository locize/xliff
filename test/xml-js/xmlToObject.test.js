const expect = require('expect.js');
const ElementTypes = require('../../inline-elements/ElementTypes');
const ElementTypes12 = require('../../inline-elements/ElementTypes12');
const elementTypeToTag = require('../../inline-elements/typeToTagMaps').elementTypeToTag;
const extractValue = require('../../xml-js/xmlToObject').extractValue;

describe('extractValue() converts XML source/target values into xliff.js objects', () => {

  it('returns an empty string for `undefined`, `null`, and `""`', () => {
    expect(extractValue(undefined, ElementTypes12)).to.eql('');
    expect(extractValue(null, ElementTypes12)).to.eql('');
    expect(extractValue('', ElementTypes12)).to.eql('');
  });

  it('turns a text element into a string', () => {
    expect(extractValue({ type: 'text', text: 'Hello' }, ElementTypes12)).to.eql('Hello');
  });

  it('removes trailing line breaks from a "formatted" XML text element', () => {
    expect(extractValue({ type: 'text', text: 'Hello \n' }, ElementTypes12)).to.eql('Hello ');
  });

  it('removes a trailing line break and space from a "formatted" XML text element', () => {
    expect(extractValue({ type: 'text', text: 'Hello \n   ' }, ElementTypes12)).to.eql('Hello ');
  });

  it('removes trailing line breaks from a "formatted" XML text element with an embedded line break', () => {
    expect(extractValue({ type: 'text', text: 'Hello \n There\n   ' }, ElementTypes12)).to.eql('Hello \n There');
  });

  it('does not throw away content from a "formatted" XML text element with no trailing line break', () => {
    expect(extractValue({ type: 'text', text: 'Hello \n There' }, ElementTypes12)).to.eql('Hello \n There');
  });

  it('creates objects for all supported inline element types', () => {
    const supportedElementTypes = Object.keys(ElementTypes);
    supportedElementTypes.forEach((expectedType) => {
      expect(extractValue({ type: 'element', name: elementTypeToTag(expectedType, ElementTypes12), attributes: { id: '1' } }, ElementTypes12)).to.have.property(expectedType);
    });
  });

  it('returns an empty string for an unknown inline element type (or other object', () => {
    expect(extractValue({ type: 'element', name: 'foo', attributes: { id: '1' } }, ElementTypes12)).to.eql('');
  });

  it('turns an array of elements into an array of value segment objects', () => {
    const values = [
      { type: 'text', text: 'Hello '},
      { type: 'text', text: 'World' },
    ];

    expect(extractValue(values, ElementTypes12)).to.eql(['Hello ', 'World']);
  });

  it('turns an array with only one member into a single value', () => {
    expect(extractValue([{ type: 'text', text: 'Hello' }], ElementTypes12)).to.eql('Hello');
  });
});
