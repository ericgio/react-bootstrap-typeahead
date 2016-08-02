import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';

import TokenizerInput from '../src/TokenizerInput.react';

import states from '../example/exampleData';

describe('<TokenizerInput>', () => {

  it('renders a TokenizerInput', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TokenizerInput
        options={[]}
        selected={[]}
        text=""
      />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-tokenizer'
    );

    expect(inputNode).to.exist;
  });

  it('renders tokens in the tokenizer', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TokenizerInput
        options={states}
        selected={states.slice(0, 3)}
        text=""
      />
    );
    const tokens = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'token'
    );

    expect(tokens.length).to.equal(3);
  });  

});
