import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import TypeaheadInput from '../src/TypeaheadInput.react';

function getInputNode(instance) {
  return ReactTestUtils.findRenderedDOMComponentWithClass(
    instance,
    'bootstrap-typeahead-input-main'
  );
}

describe('<TypeaheadInput>', () => {

  it('renders a TypeaheadInput', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TypeaheadInput
        options={[]}
        selected={[]}
        text=""
      />
    );
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-typeahead-input'
    );

    expect(inputNode).to.exist;
  });

  it('displays the selected text', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TypeaheadInput
        selected={[]}
        value="California"
      />
    );
    const inputNode = getInputNode(instance);

    expect(inputNode.value).to.equal('California');
  });

  it('displays a hint', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <TypeaheadInput
        hintText="Alabama"
        selected={[]}
      />
    );
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const hintNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-typeahead-input-hint'
    );

    expect(hintNode.value).to.equal('Alabama');
  });

});
