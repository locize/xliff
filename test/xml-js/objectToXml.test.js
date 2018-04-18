const expect = require('expect.js');
const ElementTypes = require('../../inline-elements/ElementTypes');
const ElementTypes12 = require('../../inline-elements/ElementTypes12');
const elementTypeToTag = require('../../inline-elements/typeToTagMaps').elementTypeToTag;
const makeElement = require('../../xml-js/objectToXml').makeElement;
const makeText = require('../../xml-js/objectToXml').makeText;
const makeValue = require('../../xml-js/objectToXml').makeValue;

describe('makeElement() makes XML element objects that are compatible with xml-js', () => {
  it('makes an XML element', () => {
    expect(makeElement('body')).to.eql({ type: 'element', name: 'body' });
  });

  it('includes attributes', () => {
    const expectedAttributes = { attr1: 'value1' };
    expect(makeElement('body', expectedAttributes)).to.eql({
      type: 'element',
      name: 'body',
      attributes: expectedAttributes,
    });
  });

  it('includes child elements', () => {
    const expectedChildren = [{ type: 'text', text: 'Bonjour' }];
    expect(makeElement('body', null, expectedChildren)).to.eql({
      type: 'element',
      name: 'body',
      elements: expectedChildren,
    });
  });

  it('creates an empty array for child elements if `elements` is `true`', () => {
    expect(makeElement('body', null, true)).to.eql({
      type: 'element',
      name: 'body',
      elements: [],
    });
  });
});

describe('makeText() makes XML text node objects that are compatible with xml-js', () => {
  it('makes an object with the correct shape', () => {
    expect(makeText('Hello')).to.eql({ type: 'text', text: 'Hello' });
  });
});

describe('makeValue() makes object structures representing whole values', () => {
  it('wraps non-arrays as text-in-array', () => {
    expect(makeValue('Hello', ElementTypes12)).to.eql([{ type: 'text', text: 'Hello' }]);
  });

  it('turns strings into text-element objects', () => {
    expect(makeValue(['Hello'], ElementTypes12)).to.eql([{ type: 'text', text: 'Hello' }]);
  });

  describe('inline elements', () => {
    it('creates all supported element types', () => {
      const supportedElementTypes = Object.keys(ElementTypes);//['x', 'g', 'bx', 'ex', 'ph', 'bpt', 'ept'];
      supportedElementTypes.forEach((expectedType) => {
        expect(makeValue([{ [expectedType]: { id: '1' } }], ElementTypes12)[0]).to.have.property('name', elementTypeToTag(expectedType, ElementTypes12));
      });
    });

    it('copies the `id` as an attribute', () => {
      const expectedId = '1';
      expect(makeValue([{ [ElementTypes.Span]: { id: expectedId } }], ElementTypes12)[0].attributes).to.have.property('id', expectedId);
    });

    it('creates a value for the `contents` property', () => {
      const expectedText = 'World';
      const expectedContents = makeText(expectedText);

      expect(makeValue([{ [ElementTypes.Span]: { id: '1', contents: expectedText }}], ElementTypes12)[0].elements).to.eql([expectedContents]);
    });

    it('does not include an `elements` property if the `contents` property is `undefined`', () => {
      expect(makeValue([{ [ElementTypes.Standalone]: { id: '1' } }], ElementTypes12)[0]).to.not.have.property('elements');
    });

    it('passes through any other attributes', () => {
      const valueSegment = makeValue([{ [ElementTypes.Standalone]: { id: '1', foo: 'bar', food: 'truck' }}], ElementTypes12)[0];
      const attributes = valueSegment.attributes;

      expect(attributes).to.have.property('foo', 'bar');
      expect(attributes).to.have.property('food', 'truck');
    });
  });

  it('creates an XML comment if the element type is not recognized', () => {
    expect(makeValue([{ foo: 'bar' }], ElementTypes12)).to.eql([{ type: 'comment', comment: 'Warning: unexpected segment { foo: "bar" } was ignored' }]);
  });
});
