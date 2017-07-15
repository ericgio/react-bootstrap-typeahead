import {expect} from 'chai';
import {head, noop} from 'lodash';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import TypeaheadInput from '../src/TypeaheadInput';

import options from '../example/exampleData';
import {RETURN, TAB} from '../src/utils/keyCode';

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

function simulateKeyDown(instance, keyCode) {
  const inputNode = getInputNode(instance);
  ReactTestUtils.Simulate.focus(inputNode);
  ReactTestUtils.Simulate.keyDown(inputNode, {
    keyCode,
    which: keyCode,
  });
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

  describe('behavior when selecting the hinted result', () => {
    let props;
    let keyCode;
    let selected;

    beforeEach(() => {
      keyCode = 0;
      selected = [];
      props = {
        ...baseProps,
        initialItem: head(options),
        onAdd: selectedItem => selected = [selectedItem],
        onKeyDown: e => keyCode = e.keyCode,
        selected,
        text: 'Ala',
      };
    });

    it('should select the hinted result on tab keydown', () => {
      const instance = renderTypeaheadInput(props);
      simulateKeyDown(instance, TAB);

      expect(keyCode).to.equal(TAB);
      expect(selected.length).to.equal(1);
    });

    it('should not select the hinted result on enter keydown', () => {
      const instance = renderTypeaheadInput(props);
      simulateKeyDown(instance, RETURN);

      expect(keyCode).to.equal(RETURN);
      expect(selected.length).to.equal(0);
    });

    it('should select the hinted result on enter keydown', () => {
      const instance = renderTypeaheadInput({
        ...props,
        selectHintOnEnter: true,
      });
      simulateKeyDown(instance, RETURN);

      expect(keyCode).to.equal(RETURN);
      expect(selected.length).to.equal(1);
    });
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
