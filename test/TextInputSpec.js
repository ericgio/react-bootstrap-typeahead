import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';

import TextInput from '../src/TextInput.react';

describe('<TextInput>', () => {
  it('renders a text input', () => {
    const instance = ReactTestUtils.renderIntoDocument(<TextInput />);
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'form-control'
    );

    expect(inputNode).to.exist;
  });

  it('renders a large input', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TextInput bsSize="large" />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'input-lg'
    );

    expect(inputNode).to.exist;
  });

  it('renders a small input', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TextInput bsSize="small" />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'input-sm'
    );

    expect(inputNode).to.exist;
  });
});
