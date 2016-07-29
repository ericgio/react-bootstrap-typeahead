import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';

import MenuItem from '../src/MenuItem.react';
import TokenizerInput from '../src/TokenizerInput.react';
import Typeahead from '../src/Typeahead.react';
import TypeaheadInput from '../src/TypeaheadInput.react';
import TypeaheadMenu from '../src/TypeaheadMenu.react';

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

  it(
    'should display tokens when selections are passed into the tokenizer',
    () => {
      const instance = ReactTestUtils.renderIntoDocument(
        <Typeahead
          labelKey="name"
          multiple
          options={states}
          selected={states.slice(0, 3)}
        />
      );
      const tokens = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        instance,
        'token'
      );

      expect(tokens.length).to.equal(3);
    }
  );

  it('should display a menu when the input is focused', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead options={[]} />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-typeahead-input-main'
    );
    ReactTestUtils.Simulate.focus(inputNode);

    const menuNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-typeahead-menu'
    );

    expect(menuNode).to.exist;
  });

  it('should not display a menu on focus when `minLength = 1`', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead minLength={1} options={[]} />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-typeahead-input-main'
    );
    ReactTestUtils.Simulate.focus(inputNode);

    const menuNode = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'bootstrap-typeahead-menu'
    );

    expect(menuNode.length).to.equal(0);
  });

  it('should disable the input if the component is disabled', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead disabled options={[]} />
    );
    const input = ReactTestUtils.findRenderedComponentWithType(
      instance,
      TypeaheadInput
    );

    expect(input.props.disabled).to.be.true;
  });

});
