import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import TokenizerInput from '../src/TokenizerInput';

import options from '../example/exampleData';

let props = {
  placeholder: 'select one',

  labelKey: 'name',
  options,
  selected: [],
  text: '',
};

describe('<TokenizerInput>', () => {

  it('renders a TokenizerInput', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TokenizerInput {...props} />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-tokenizer'
    );

    expect(inputNode).to.exist;
  });

  it('renders tokens in the tokenizer', () => {
    props.selected = options.slice(0, 3);
    const instance = ReactTestUtils.renderIntoDocument(
      <TokenizerInput {...props} />
    );
    const tokens = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'token'
    );

    expect(tokens.length).to.equal(3);
  });

  it('should set the size of the tokenizer input', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TokenizerInput {...props} bsSize="large" />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'input-lg'
    );

    expect(inputNode).to.exist;
  });

});
