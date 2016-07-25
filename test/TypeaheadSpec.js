import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';

import Typeahead from '../src/Typeahead.react';
import TokenizerInput from '../src/TokenizerInput.react';
import TypeaheadInput from '../src/TypeaheadInput.react';

import states from '../example/exampleData';

describe('<Typeahead>', () => {

  it('should have a TypeaheadInput', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead options={[]} />
    );
    const input = ReactTestUtils.findRenderedComponentWithType(
      instance,
      TypeaheadInput
    );

    expect(input).to.exist;
  });

  it('should have a TokenizerInput when `multiple` is `true`', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead multiple options={[]} />
    );
    const tokenizer = ReactTestUtils.findRenderedComponentWithType(
      instance,
      TokenizerInput
    );

    expect(tokenizer).to.exist;
  });

});
