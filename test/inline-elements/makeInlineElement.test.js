const expect = require('expect.js');
const makeInlineElement = require('../../inline-elements/makeInlineElement');

describe('makeInlineElement()', () => {

  it('sets the element type', () => {
    const expectedElementType = 'Standalone';

    expect(makeInlineElement(expectedElementType)).to.have.property(expectedElementType);
  });

  it('sets the element id', () => {
    const expectedId = '5';

    expect(makeInlineElement('Standalone', expectedId)['Standalone']).to.have.property('id', expectedId);
  });

  it('sets element contents', () => {
    const expectedContents = 'Wahoo!';

    expect(makeInlineElement('Span', '7', null, expectedContents)['Span']).to.have.property('contents', expectedContents);
  });

  it('sets other arbitrary attributes', () => {
    const passedAttributes = {
      foo: 'bar',
      food: 'truck',
    };

    const elementValuesObj = makeInlineElement('Standalone', '9', passedAttributes)['Standalone'];
    expect(elementValuesObj).to.have.property('foo', passedAttributes['foo']);
    expect(elementValuesObj).to.have.property('food', passedAttributes['food']);
  });

  it('does not overwrite the id if an id attribute is specified', () => {
    const expectedId = '7';

    expect(makeInlineElement('Standalone', expectedId, { id: '-1' })['Standalone']).to.have.property('id', expectedId);
  });

});
