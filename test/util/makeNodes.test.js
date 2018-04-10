const expect = require('expect.js');
const makeElement = require('../../util/makeNodes').makeElement;
const makeText = require('../../util/makeNodes').makeText;

describe('makeElement() makes XML elements that are compatible with xml-js', () => {
  makeElement();
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

describe('makeText() makes XML text nodes that are compatible with xml-js', () => {
  it('makes an object with the correct shape', () => {
    expect(makeText('Hello')).to.eql({ type: 'text', text: 'Hello' });
  });
});
