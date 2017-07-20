import {expect} from 'chai';
import {head, range} from 'lodash';
import React from 'react';
import {render} from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import Typeahead from '../src/Typeahead';
import TypeaheadInput from '../src/TypeaheadInput';

import {getInputNode, getMenuNode} from './testUtils';

import states from '../example/exampleData';
import {BACKSPACE, RETURN} from '../src/utils/keyCode';

const bigData = range(0, 500).map(o => o.toString());

let baseProps = {
  labelKey: 'name',
  options: states,
};

function getMenuItems(instance) {
  return ReactTestUtils.scryRenderedDOMComponentsWithTag(
    instance,
    'LI'
  );
}

function getTypeaheadInstance(props) {
  return ReactTestUtils.renderIntoDocument(<Typeahead {...props} />);
}

function simulateTextChange(inputNode, value) {
  inputNode.value = value;
  ReactTestUtils.Simulate.change(inputNode);
}

function simulateFormSubmit(instance) {
  const inputNode = getInputNode(instance);
  ReactTestUtils.Simulate.focus(inputNode);
  ReactTestUtils.Simulate.keyDown(inputNode, {
    key: 'Enter', keyCode: RETURN, which: RETURN,
  });
}

class FormWrapper extends React.Component {
  render() {
    return (
      <form onKeyDown={this.props.onKeyDown}>
        <Typeahead {...this.props} />
      </form>
    );
  }
}

function getFormWithTypeaheadInstance(props) {
  return ReactTestUtils.renderIntoDocument(<FormWrapper {...props}/>);
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

  it('should render in multi-select mode when `multiple=true`', () => {
    const instance = getTypeaheadInstance({
      ...baseProps,
      multiple: true,
    });

    const node = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-input-multi'
    );

    expect(node).to.exist;
  });

  it(
    'should display tokens when selections are passed into the tokenizer',
    () => {
      const instance = getTypeaheadInstance({
        ...baseProps,
        multiple: true,
        selected: states.slice(0, 3),
      });

      const tokens = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        instance,
        'rbt-token'
      );

      expect(tokens.length).to.equal(3);
    }
  );

  describe('truncates the selections in single-select mode', () => {
    let multiSelections, node, props, selected;

    beforeEach(() => {
      multiSelections = states.slice(0, 4);
      node = document.createElement('div');
      selected = [];
      props = {
        ...baseProps,
        onChange: s => selected = s,
      };
      render(<Typeahead {...props} />, node);
    });

    it('when using `defaultSelected`', () => {
      const instance = getTypeaheadInstance({
        ...props,
        defaultSelected: multiSelections,
      });

      const inputNode = getInputNode(instance);
      simulateTextChange(inputNode, BACKSPACE);

      expect(selected.length).to.equal(0);
    });

    it('when using `selected`', () => {
      const instance = getTypeaheadInstance({
        ...props,
        selected: multiSelections,
      });

      const inputNode = getInputNode(instance);
      simulateTextChange(inputNode, BACKSPACE);

      expect(selected.length).to.equal(0);
    });

    it('when going from multi- to single-select', () => {
      render(
        <Typeahead {...props} multiple selected={multiSelections} />,
        node
      );
      expect(selected.length).to.equal(multiSelections.length);

      render(<Typeahead {...props} selected={multiSelections} />, node);
      expect(selected).to.deep.equal(states.slice(0, 1));
    });
  });

  it('should display a menu when the input is focused', () => {
    const instance = getTypeaheadInstance(baseProps);
    const menuNode = getMenuNode(instance);

    expect(menuNode).to.exist;
  });

  it('should not display a menu on focus when `minLength=1`', () => {
    const instance = getTypeaheadInstance({
      ...baseProps,
      minLength: 1,
    });
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);
    const menuNode = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'rbt-menu'
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

  it('should have a menu item for pagination', () => {
    let didPaginate = false;
    const onPaginate = () => didPaginate = true;
    const paginationText = 'See More';

    const instance = getTypeaheadInstance({
      onPaginate,
      options: bigData,
      paginationText,
    });
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    // Get the anchor node, not the `<li>`
    const paginatorAnchorNode =
      ReactTestUtils.findRenderedDOMComponentWithClass(
        instance,
        'rbt-menu-paginator'
      ).firstChild;

    ReactTestUtils.Simulate.click(paginatorAnchorNode);

    expect(paginatorAnchorNode).to.exist;
    expect(paginatorAnchorNode.innerHTML).to.equal(paginationText);
    expect(didPaginate).to.equal(true);
  });

  it('should not have a menu item for pagination', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Typeahead options={bigData} paginate={false} />
    );
    const inputNode = getInputNode(instance);
    ReactTestUtils.Simulate.focus(inputNode);

    const paginatorNodes = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      instance,
      'rbt-menu-paginator'
    );

    expect(paginatorNodes.length).to.equal(0);
  });

  describe('should limit the results when `maxResults` is set', () => {
    const maxResults = 5;

    it('should limit results when `paginate=true`', () => {
      const instance = getTypeaheadInstance({
        ...baseProps,
        maxResults,
      });

      const inputNode = getInputNode(instance);
      ReactTestUtils.Simulate.focus(inputNode);

      const menuItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(
        instance,
        'LI'
      );

      // When `paginate` is true, it adds 2 menu items to the menu: one for the
      // divider and one for the paginator.
      expect(menuItems.length).to.equal(maxResults + 2);
    });

    it('should limit results when `paginate=false`', () => {
      const instance = getTypeaheadInstance({
        ...baseProps,
        maxResults,
        paginate: false,
      });

      const inputNode = getInputNode(instance);
      ReactTestUtils.Simulate.focus(inputNode);

      const menuItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(
        instance,
        'LI'
      );

      // When `paginate` is true, it adds 2 menu items to the menu: one for the
      // divider and one for the paginator.
      expect(menuItems.length).to.equal(maxResults);
    });
  });

  it('should add the `dropup` className when `dropup=true`', () => {
    const instance = getTypeaheadInstance({...baseProps, dropup: true});
    const TypeaheadNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'dropup'
    );

    expect(TypeaheadNode).to.exist;
  });

  it('should set the size of the typeahead input', () => {
    const instance = getTypeaheadInstance({...baseProps, bsSize: 'large'});
    const InputNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-input-container input-lg'
    );

    expect(InputNode).to.exist;
  });

  it('displays a loader when `isLoading=true`', () => {
    const instance = getTypeaheadInstance({...baseProps, isLoading: true});
    const LoaderNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-loader'
    );

    expect(LoaderNode).to.exist;
  });

  it('displays a clear button when `clearButton=true` and there is a ' +
     'selection', () => {
    const instance = getTypeaheadInstance({
      ...baseProps,
      clearButton: true,
      selected: states.slice(0, 1),
    });

    const ClearButtonNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-close'
    );

    expect(ClearButtonNode).to.exist;
  });

  describe('updates when re-rendering with new props', () => {
    let node, selected, text;

    const props = {
      ...baseProps,
      onChange: s => selected = s,
      onInputChange: t => text = t,
    };

    beforeEach(() => {
      node = document.createElement('div');
      render(<Typeahead {...props} />, node);
    });

    it('acts as a controlled input in single-select mode', () => {
      const selected1 = states.slice(0, 1);
      const selected2 = states.slice(1, 2);

      // Pass in new selection
      render(<Typeahead {...props} selected={selected1} />, node);

      expect(selected).to.deep.equal(selected1);
      expect(text).to.equal(selected1[0][baseProps.labelKey]);

      // Pass in another new selection
      render(<Typeahead {...props} selected={selected2} />, node);

      expect(selected).to.deep.equal(selected2);
      expect(text).to.equal(selected2[0][baseProps.labelKey]);

      // "Clear" the component
      render(<Typeahead {...props} selected={[]} />, node);

      expect(selected).to.deep.equal([]);
      expect(text).to.equal('');
    });

    it('acts as a controlled input in multi-select mode', () => {
      const selected1 = states.slice(0, 4);

      // Pass in new selection
      render(<Typeahead {...props} multiple selected={selected1} />, node);

      expect(selected).to.deep.equal(selected1);
      expect(text).to.equal('');

      // "Clear" the component
      render(<Typeahead {...props} multiple selected={[]} />, node);

      expect(selected).to.deep.equal([]);
      expect(text).to.equal('');
    });
  });

  describe('`highlightOnlyResult` behavior', () => {
    let props;
    let selected;

    function simulateEnter(node) {
      ReactTestUtils.Simulate.keyDown(node, {
        key: 'Enter',
        keyCode: RETURN,
        which: RETURN,
      });
    }

    beforeEach(() => {
      props = {
        ...baseProps,
        onChange: s => selected = [s],
      };
      selected = [];
    });

    it('does not highlight the only result', () => {
      const instance = getTypeaheadInstance(props);

      const inputNode = getInputNode(instance);
      simulateTextChange(inputNode, 'Alab');
      ReactTestUtils.Simulate.focus(inputNode);

      const menuItems = getMenuItems(instance);

      expect(menuItems.length).to.equal(1);
      expect(head(menuItems).className).to.equal('');

      simulateEnter(inputNode);
      expect(selected.length).to.equal(0);
    });

    it('highlights the only result', () => {
      const instance = getTypeaheadInstance({
        ...props,
        highlightOnlyResult: true,
      });

      const inputNode = getInputNode(instance);
      simulateTextChange(inputNode, 'Alab');
      ReactTestUtils.Simulate.focus(inputNode);

      const menuItems = getMenuItems(instance);

      expect(menuItems.length).to.equal(1);
      expect(head(menuItems).className).to.equal('active');

      simulateEnter(inputNode);
      expect(selected.length).to.equal(1);
    });

    it('does not highlights the only result when `allowNew=true`', () => {
      const instance = getTypeaheadInstance({
        ...props,
        allowNew: true,
        highlightOnlyResult: true,
      });

      const inputNode = getInputNode(instance);
      simulateTextChange(inputNode, 'qqq');
      ReactTestUtils.Simulate.focus(inputNode);

      const menuItems = getMenuItems(instance);

      expect(menuItems.length).to.equal(1);
      expect(head(menuItems).className).to.equal('');

      simulateEnter(inputNode);
      expect(selected.length).to.equal(0);
    });
  });

  // DEPRECATED
  it('adds a name to the input', () => {
    const name = 'input-name';
    const instance = getTypeaheadInstance({...baseProps, name});
    const inputNode = getInputNode(instance);

    expect(inputNode.name).to.equal(name);
  });

  it('applies arbitrary attributes to the input', () => {
    const inputProps = {
      className: 'input-classname',
      id: 'input-id',
      name: 'input-name',
      tabIndex: 5,
      type: 'number',
    };

    const instance = getTypeaheadInstance({
      ...baseProps,
      inputProps,
      multiple: true,
      selected: states.slice(0, 1),
    });
    const inputNode = getInputNode(instance);

    expect(inputNode.className).to.contain(inputProps.className);
    expect(inputNode.id).to.equal(inputProps.id);
    expect(inputNode.name).to.equal(inputProps.name);
    expect(inputNode.tabIndex).to.equal(inputProps.tabIndex);
    expect(inputNode.type).to.equal(inputProps.type);

    const tokenNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-token'
    );
    expect(tokenNode.tabIndex).to.equal(inputProps.tabIndex);
  });

  it('triggers the `onKeyDown` prop', () => {
    let keyDown;
    const instance = getTypeaheadInstance({
      ...baseProps,
      onKeyDown: e => keyDown = 'success',
    });

    simulateFormSubmit(instance);

    expect(keyDown).to.equal('success');
  });

  describe('form integration', () => {
    let onKeyDownEvent;

    beforeEach(() => {
      onKeyDownEvent = null;
    });

    const onKeyDown = e => onKeyDownEvent = e;

    /**
     * Since react test simulation doesn't trigger form submit on RETURN press,
     * we should handle keyDown event on form level and test whether default was
     * prevented or not.
     */
    it('should not submit form when `submitFormOnEnter=false', () => {
      const instance = getFormWithTypeaheadInstance({
        ...baseProps,
        submitFormOnEnter: false,
        onKeyDown,
      });
      simulateFormSubmit(instance);

      expect(onKeyDownEvent.defaultPrevented).to.equal(true);
    });

    it('should submit form when `submitFormOnEnter=true', () => {
      const instance = getFormWithTypeaheadInstance({
        ...baseProps,
        submitFormOnEnter: true,
        onKeyDown,
      });
      simulateFormSubmit(instance);

      expect(onKeyDownEvent.defaultPrevented).to.equal(undefined);
    });
  });

});
