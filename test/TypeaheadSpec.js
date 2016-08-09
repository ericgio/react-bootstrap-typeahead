import {expect} from 'chai';
import {range} from 'lodash';
import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';

import TokenizerInput from '../src/TokenizerInput.react';
import Typeahead from '../src/Typeahead.react';
import TypeaheadInput from '../src/TypeaheadInput.react';

import states from '../example/exampleData';

const bigData = range(0, 500).map(o => o.toString());

let baseProps = {
  options: [],
};

function getInputNode(instance) {
  return ReactTestUtils.findRenderedDOMComponentWithClass(
    instance,
    'bootstrap-typeahead-input-main'
  );
}

function getMenuNode(instance) {
  return ReactTestUtils.findRenderedDOMComponentWithClass(
    instance,
    'bootstrap-typeahead-menu'
  );
}

function getTypeaheadInstance(props) {
  return ReactTestUtils.renderIntoDocument(<Typeahead {...props} />);
}

describe('<Typeahead>', () => {

  it('should have a TypeaheadInput', () => {
    const instance = getTypeaheadInstance(baseProps);
    const input = ReactTestUtils.findRenderedComponentWithType(
      instance,
      TypeaheadInput
    );

    expect(input).to.exist;
  });

  it('should have a TokenizerInput when `multiple` is `true`', () => {
    const instance = getTypeaheadInstance({
      ...baseProps,
      multiple: true,
    });
    const tokenizer = ReactTestUtils.findRenderedComponentWithType(
      instance,
      TokenizerInput
    );

    expect(tokenizer).to.exist;
  });

  it(
    'should display tokens when selections are passed into the tokenizer',
    () => {
      const instance = getTypeaheadInstance({
        labelKey: "name",
        multiple: true,
        options: states,
        selected: states.slice(0, 3),
      });
      const tokens = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        instance,
        'token'
      );

      expect(tokens.length).to.equal(3);
    }
  );

  it('should display a menu when the input is focused', () => {
    const instance = getTypeaheadInstance(baseProps);
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const menuNode = getMenuNode(instance);

    expect(menuNode).to.exist;
  });

  it('should not display a menu on focus when `minLength = 1`', () => {
    const instance = getTypeaheadInstance({
      ...baseProps,
      minLength: 1,
    });
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const menuNode = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'bootstrap-typeahead-menu'
    );

    expect(menuNode.length).to.equal(0);
  });

  it('should disable the input if the component is disabled', () => {
    const instance = getTypeaheadInstance({
      ...baseProps,
      disabled: true,
    });
    const input = ReactTestUtils.findRenderedComponentWithType(
      instance,
      TypeaheadInput
    );

    expect(input.props.disabled).to.be.true;
  });

  it('should display a menu item for pagination', () => {
    const paginationText = 'See More';
    const instance = getTypeaheadInstance({
      options: bigData,
      paginationText,
    });
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const paginatorNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'bootstrap-typeahead-menu-paginator'
    );

    expect(paginatorNode).to.exist;
    expect(paginatorNode.firstChild.innerHTML).to.equal(paginationText);
  });

  it('should not display a menu item for pagination', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead options={bigData} paginate={false} />
    );
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const paginatorNodes = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'bootstrap-typeahead-menu-paginator'
    );

    expect(paginatorNodes.length).to.equal(0);
  });

});
