import {expect} from 'chai';
import {head, noop} from 'lodash';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import TypeaheadInput from '../src/TypeaheadInput';

import options from '../example/exampleData';

const baseProps = {
  labelKey: 'name',
  onFocus: noop,
  options,
  selected: [],
  text: '',
};

function renderTypeaheadInput(props) {
  return ReactTestUtils.renderIntoDocument(<TypeaheadInput {...props} />);
}

function getInputNode(instance) {
  return ReactTestUtils.findRenderedDOMComponentWithClass(
    instance,
    'rbt-input-main'
  );
}

describe('<TypeaheadInput>', () => {

  it('renders a TypeaheadInput', () => {
    const instance = renderTypeaheadInput(baseProps);
    const inputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-input'
    );

    expect(inputNode).to.exist;
  });

  it('displays the selected text', () => {
    const text = 'text';
    const instance = renderTypeaheadInput({...baseProps, text});
    const inputNode = getInputNode(instance);

    expect(inputNode.value).to.equal(text);
  });

  it('displays a hint', () => {
    const initialItem = head(options);
    const text = 'Al';
    const instance = renderTypeaheadInput({
      ...baseProps,
      initialItem,
      text,
    });

    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const hintNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-input-hint'
    );

    expect(hintNode.value).to.equal(initialItem.name);
  });

  it('renders a large input', () => {
    const instance = renderTypeaheadInput({...baseProps, bsSize: 'large'});
    const node = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'input-lg'
    );

    expect(node).to.exist;
  });

  it('renders a small input', () => {
    const instance = renderTypeaheadInput({...baseProps, bsSize: 'small'});
    const node = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'input-sm'
    );

    expect(node).to.exist;
  });

  describe('multi-select state', () => {
    let multiProps;

    beforeEach(() => {
      multiProps = {...baseProps, multiple: true};
    });

    it('renders a multi-select input', () => {
      const instance = renderTypeaheadInput(multiProps);
      const node = ReactTestUtils.findRenderedDOMComponentWithClass(
        instance,
        'rbt-input-multi'
      );

      expect(node).to.exist;
    });

    it('renders tokens in the input', () => {
      const instance = renderTypeaheadInput({
        ...multiProps,
        selected: options.slice(0, 3),
      });

      const tokens = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        instance,
        'rbt-token'
      );

      expect(tokens.length).to.equal(3);
    });
  });

});
