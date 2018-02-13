import {expect} from 'chai';
import {mount} from 'enzyme';
import {head} from 'lodash';
import React from 'react';
import sinon from 'sinon';

import Typeahead from '../../src/Typeahead';
import TypeaheadInput from '../../src/TypeaheadInput';

import {bigDataSet, change, focus, getHint, getInput, getMenu, getMenuItems, getPaginator, keyDown} from '../helpers';

import states from '../../example/exampleData';
import {BACKSPACE, DOWN, ESC, RETURN, UP} from '../../src/constants/keyCode';

function cycleThroughMenuAndGetActiveItem(wrapper, dir) {
  keyDown(wrapper, dir);
  return wrapper.find('a.active');
}

function mountTypeahead(props) {
  return mount(
    <Typeahead
      labelKey="name"
      options={states}
      {...props}
    />
  );
}

function getClearButton(wrapper) {
  return wrapper.find('.rbt-close');
}

describe('<Typeahead>', () => {
  let typeahead;

  beforeEach(() => {
    typeahead = mountTypeahead();
  });

  it('should have a TypeaheadInput', () => {
    expect(typeahead.find(TypeaheadInput)).to.have.length(1);
  });

  it('should render in multi-select mode when `multiple=true`', () => {
    typeahead.setProps({multiple: true});
    expect(typeahead.find('.rbt-input-multi')).to.have.length(1);
  });

  it('should display tokens when selections are passed in', () => {
    typeahead.setProps({
      multiple: true,
      selected: states.slice(0, 3),
    });
    expect(typeahead.find('.rbt-token')).to.have.length(3);
  });

  it('sets and unsets the focus state on focus/blur', () => {
    const hasFocus = (wrapper) => (
      wrapper.find('.form-control').hasClass('focus')
    );
    const input = getInput(typeahead);

    expect(hasFocus(typeahead)).to.equal(false);

    input.simulate('focus');
    expect(hasFocus(typeahead)).to.equal(true);

    input.simulate('blur');
    expect(hasFocus(typeahead)).to.equal(false);
  });

  describe('behaviors when selections are passed in', () => {
    const getSelected = (wrapper) => (
      // Because of all the HOCs, getting the typeahead's state is messy.
      // Get the selected value from the props passed to the input.
      typeahead.find(TypeaheadInput).prop('selected')
    );
    const multiSelections = states.slice(0, 4);
    const onChange = (s) => selected = s;

    let selected;

    beforeEach(() => {
      selected = [];
    });

    it('truncates selections when using `defaultSelected`', () => {
      typeahead = mountTypeahead({
        defaultSelected: multiSelections,
        onChange,
      });

      expect(getSelected(typeahead).length).to.equal(1);

      keyDown(typeahead, BACKSPACE);
      expect(selected.length).to.equal(0);
    });

    it('truncates selections when using `selected`', () => {
      typeahead.setProps({selected: multiSelections});

      expect(getSelected(typeahead).length).to.equal(1);

      keyDown(typeahead, BACKSPACE);
      expect(selected.length).to.equal(0);
    });

    it('truncates selections when going from multi- to single-select', () => {
      typeahead.setProps({
        multiple: true,
        onChange,
        selected: multiSelections,
      });

      expect(getSelected(typeahead).length).to.equal(multiSelections.length);

      typeahead.setProps({multiple: false});

      expect(selected.length).to.equal(1);
      expect(selected).to.deep.equal(states.slice(0, 1));
    });

    it('filters menu options based on `selected` values', () => {
      selected = states.slice(0, 1);
      typeahead.setProps({selected});

      focus(typeahead);

      expect(getInput(typeahead).props().value).to.equal(head(selected).name);
      expect(getMenuItems(typeahead).length).to.equal(1);
    });

    it('filters menu options based on `defaultSelected` values', () => {
      const defaultSelected = states.slice(0, 1);
      const value = head(defaultSelected).name;

      typeahead = mountTypeahead({defaultSelected, onChange});

      focus(typeahead);

      expect(getInput(typeahead).props().value).to.equal(value);
      expect(getMenuItems(typeahead).length).to.equal(1);
    });
  });

  describe('input value behaviors', () => {
    let defaultInputValue, defaultSelected, selected;

    beforeEach(() => {
      defaultInputValue = 'This is a default value';
      defaultSelected = selected = states.slice(0, 1);
    });

    it('sets a default initial input value', () => {
      typeahead = mountTypeahead({defaultInputValue});
      expect(getInput(typeahead).props().value).to.equal(defaultInputValue);
    });

    it('sets an input value based on the `selected` value', () => {
      typeahead.setProps({selected});
      expect(getInput(typeahead).props().value).to.equal(head(selected).name);
    });

    it('sets an input value based on the `defaultSelected` value', () => {
      typeahead = mountTypeahead({defaultSelected});
      const inputValue = getInput(typeahead).props().value;
      expect(inputValue).to.equal(head(defaultSelected).name);
    });

    it('overrides the initial input value', () => {
      typeahead = mountTypeahead({defaultInputValue, selected});
      expect(getInput(typeahead).props().value).to.equal(head(selected).name);
    });
  });

  describe('menu visibility behavior', () => {

    it('should display a menu when the input is focused', () => {
      focus(typeahead);
      expect(getMenu(typeahead).length).to.equal(1);
    });

    it('should not display a menu on focus when `minLength=1`', () => {
      typeahead.setProps({minLength: 1});
      focus(typeahead);
      expect(getMenu(typeahead).length).to.equal(0);
    });

    it(
      'should display a menu when there are no results, `allowNew=true`, ' +
      'and `emptyLabel` is falsy', () => {
        typeahead.setProps({
          allowNew: true,
          emptyLabel: false,
          options: [],
        });
        change(typeahead, 'xx');
        focus(typeahead);

        const menuItems = getMenuItems(typeahead);
        expect(menuItems.length).to.equal(1);
        expect(menuItems.text()).to.equal('New selection: xx');
      }
    );
  });

  it('should not display a menu if `emptyLabel` is falsy', () => {
    function getMenuWithEmptyLabel(emptyLabel) {
      typeahead = mountTypeahead({emptyLabel, options: []});
      focus(typeahead);
      return getMenu(typeahead);
    }

    let menuNode = getMenuWithEmptyLabel('');
    expect(menuNode.length).to.equal(0);

    menuNode = getMenuWithEmptyLabel(null);
    expect(menuNode.length).to.equal(0);

    menuNode = getMenuWithEmptyLabel(0);
    expect(menuNode.length).to.equal(0);
  });

  it('should disable the input if the component is disabled', () => {
    const inputProps = typeahead
      .setProps({disabled: true})
      .find(TypeaheadInput)
      .props();

    expect(inputProps.disabled).to.equal(true);
  });

  it('should not highlight disabled options', () => {
    let activeItem;

    const options = [
      {name: 'foo'},
      {disabled: true, name: 'bar'},
      {disabled: true, name: 'boo'},
      {name: 'baz'},
    ];

    typeahead = mountTypeahead({options});
    focus(typeahead);

    // Cycling down should activate the first option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.text()).to.equal(options[0].name);

    // Cycling down should skip the two disabled option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.text()).to.equal(options[3].name);

    // Cycling back up should again skip the two disabled option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, UP);
    expect(activeItem.text()).to.equal(options[0].name);
  });

  it('should have a menu item for pagination', () => {
    const onPaginate = sinon.spy();
    const paginationText = 'See More';

    typeahead.setProps({
      onPaginate,
      options: bigDataSet,
      paginationText,
    });

    focus(typeahead);
    const paginatorNode = typeahead.find('.rbt-menu-paginator a').hostNodes();

    expect(paginatorNode).to.have.length(1);
    expect(paginatorNode.text()).to.equal(paginationText);

    paginatorNode.simulate('click');
    expect(onPaginate.calledOnce).to.equal(true);
  });

  it('should not have a menu item for pagination', () => {
    typeahead.setProps({
      options: bigDataSet,
      paginate: false,
    });

    focus(typeahead);
    expect(getPaginator(typeahead)).to.have.length(0);
  });

  describe('should limit the results when `maxResults` is set', () => {
    const maxResults = 5;

    beforeEach(() => {
      typeahead = mountTypeahead({maxResults});
    });

    it('should limit results when `paginate=true`', () => {
      focus(typeahead);

      // When `paginate` is true, it adds 2 menu items to the menu: one for the
      // divider and one for the paginator.
      expect(getMenuItems(typeahead).length).to.equal(maxResults + 2);
    });

    it('should limit results when `paginate=false`', () => {
      typeahead.setProps({paginate: false});
      focus(typeahead);

      expect(getMenuItems(typeahead).length).to.equal(maxResults);
    });
  });

  it('should add the `dropup` className when `dropup=true`', () => {
    typeahead.setProps({dropup: true});
    expect(typeahead.find('.dropup')).to.have.length(1);
  });

  it('renders a large input', () => {
    typeahead.setProps({bsSize: 'large'});
    expect(typeahead.find('.input-lg')).to.have.length(1);
  });

  it('renders a small input', () => {
    typeahead.setProps({bsSize: 'small'});
    expect(typeahead.find('.input-sm')).to.have.length(1);
  });

  it('renders a small input', () => {
    typeahead.setProps({isLoading: true});
    expect(typeahead.find('.rbt-loader')).to.have.length(1);
  });

  describe('ClearButton behavior', () => {
    beforeEach(() => {
      typeahead = mountTypeahead();
    });

    it('displays a clear button when there are selections', () => {
      typeahead.setProps({
        clearButton: true,
        selected: states.slice(0, 1),
      });

      expect(getClearButton(typeahead).length).to.equal(1);
    });

    it('does not display a clear button when there are no selections', () => {
      typeahead.setProps({
        clearButton: true,
        selected: [],
      });
      expect(getClearButton(typeahead).length).to.equal(0);
    });
  });

  describe('updates when re-rendering with new props', () => {
    let selected, text;

    beforeEach(() => {
      typeahead = mountTypeahead({
        onChange: (s) => selected = s,
        onInputChange: (t) => text = t,
      });
    });

    it('acts as a controlled input in single-select mode', () => {
      const selected1 = states.slice(0, 1);
      const selected2 = states.slice(1, 2);

      // Pass in new selection
      typeahead.setProps({selected: selected1});

      expect(selected).to.deep.equal(selected1);
      expect(text).to.equal(head(selected1).name);

      // Pass in another new selection
      typeahead.setProps({selected: selected2});

      expect(selected).to.deep.equal(selected2);
      expect(text).to.equal(head(selected2).name);

      // Clear the selections.
      typeahead.setProps({selected: []});

      expect(selected).to.deep.equal([]);
      expect(text).to.equal('');
    });

    it('acts as a controlled input in multi-select mode', () => {
      const selected1 = states.slice(0, 4);

      // Pass in new selection
      typeahead.setProps({
        multiple: true,
        selected: selected1,
      });

      expect(selected).to.deep.equal(selected1);
      expect(text).to.equal('');

      // Clear the selections.
      typeahead.setProps({selected: []});

      expect(selected).to.deep.equal([]);
      expect(text).to.equal('');
    });
  });

  describe('`highlightOnlyResult` behavior', () => {
    let selected;

    beforeEach(() => {
      selected = [];
      typeahead = mountTypeahead({
        onChange: (s) => selected = [s],
      });
    });

    it('does not highlight the only result', () => {

      change(typeahead, 'Alab');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).to.equal(1);
      expect(menuItems.hasClass('active')).to.equal(false);

      keyDown(typeahead, RETURN);

      expect(selected.length).to.equal(0);
    });

    it('highlights the only result', () => {
      typeahead.setProps({highlightOnlyResult: true});

      change(typeahead, 'Alab');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).to.equal(1);
      expect(menuItems.hasClass('active')).to.equal(true);

      keyDown(typeahead, RETURN);

      expect(selected.length).to.equal(1);
    });

    it('does not highlight the only result when `allowNew=true`', () => {
      typeahead.setProps({
        allowNew: true,
        highlightOnlyResult: true,
      });

      change(typeahead, 'qqq');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).to.equal(1);
      expect(menuItems.hasClass('active')).to.equal(false);

      keyDown(typeahead, RETURN);

      expect(selected.length).to.equal(0);
    });

    it('does not highlight or select a disabled result', () => {
      typeahead.setProps({
        highlightOnlyResult: true,
        options: [
          {name: 'foo'},
          {disabled: true, name: 'bar'},
          {disabled: true, name: 'boo'},
          {name: 'baz'},
        ],
      });

      change(typeahead, 'bar');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).to.equal(1);
      expect(menuItems.hasClass('active')).to.equal(false);

      keyDown(typeahead, RETURN);

      expect(selected.length).to.equal(0);
    });
  });

  // DEPRECATED
  it('adds a name to the input', () => {
    const name = 'input-name';

    typeahead.setProps({name});

    expect(getInput(typeahead).props().name).to.equal(name);
  });

  it('applies arbitrary attributes to the input', () => {
    const inputProps = {
      className: 'input-classname',
      id: 'input-id',
      name: 'input-name',
      tabIndex: 5,
      type: 'number',
    };

    typeahead.setProps({
      inputProps,
      multiple: true,
      selected: states.slice(0, 1),
    });

    const props = getInput(typeahead).props();

    expect(props.className).to.contain(inputProps.className);
    expect(props.id).to.equal(inputProps.id);
    expect(props.name).to.equal(inputProps.name);
    expect(props.tabIndex).to.equal(inputProps.tabIndex);
    expect(props.type).to.equal(inputProps.type);

    const token = typeahead.find('.rbt-token');
    expect(token.props().tabIndex).to.equal(inputProps.tabIndex);
  });

  it('triggers the `onKeyDown` callback', () => {
    const onKeyDown = sinon.spy();

    typeahead.setProps({onKeyDown});
    keyDown(typeahead, RETURN);

    expect(onKeyDown.calledOnce).to.equal(true);
  });

  it('triggers the `onMenuHide` and `onMenuShow` callbacks', () => {
    const onMenuHide = sinon.spy();
    const onMenuShow = sinon.spy();

    typeahead.setProps({onMenuHide, onMenuShow});

    expect(onMenuHide.notCalled).to.equal(true);
    expect(onMenuShow.notCalled).to.equal(true);

    focus(typeahead);
    expect(onMenuShow.calledOnce).to.equal(true);

    // Simulating a `blur` event doesn't actually hide the menu. Simulating an
    // `esc` keystroke does.
    keyDown(typeahead, ESC);
    expect(onMenuHide.calledOnce).to.equal(true);
  });

  describe('hint behavior', () => {
    beforeEach(() => {
      typeahead = mountTypeahead();
      change(typeahead, 'Ala');
    });

    it('does not display a hint when the input is not focused', () => {
      expect(getHint(typeahead).props().value).to.equal('');
    });

    it('displays a hint when the input is focused', () => {
      focus(typeahead);
      expect(getHint(typeahead).props().value).to.equal('Alabama');
    });

    it('does not display a hint in multi-select mode', () => {
      typeahead.setProps({multiple: true});
      expect(getHint(typeahead).length).to.equal(0);
    });

    it('does not display a hint if the menu is hidden', () => {
      focus(typeahead);

      // When focused, the typeahead should show the menu and hint text.
      expect(getMenu(typeahead).length).to.equal(1);
      expect(getHint(typeahead).props().value).to.equal('Alabama');

      keyDown(typeahead, ESC);

      // Expect the input to remain focused, but the menu and hint to be hidden.
      expect(typeahead.find('.form-control').hasClass('focus')).to.equal(true);
      expect(getMenu(typeahead).length).to.equal(0);
      expect(getHint(typeahead).props().value).to.equal('');
    });
  });

  describe('form integration', () => {
    let event;

    const onKeyDown = (e) => event = e;

    beforeEach(() => {
      event = null;
      typeahead.setProps({onKeyDown});
    });

    it('should not submit form when `submitFormOnEnter=false`', () => {
      focus(typeahead);
      keyDown(typeahead, RETURN);

      expect(event.defaultPrevented).to.equal(true);
    });

    it('should submit form when `submitFormOnEnter=true`', () => {
      typeahead.setProps({submitFormOnEnter: true});
      focus(typeahead);
      keyDown(typeahead, RETURN);

      expect(event.defaultPrevented).to.equal(undefined);
    });
  });

  describe('accessibility status', () => {
    let statusNode;

    beforeEach(() => {
      focus(typeahead);
      statusNode = typeahead.find('.rbt-sr-status');
    });

    it('lists the number of results when the input is focused', () => {
      expect(statusNode.text()).to.contain('50 results');
    });

    it('lists the number of selected items', () => {
      keyDown(typeahead, DOWN);
      keyDown(typeahead, RETURN);

      expect(statusNode.text()).to.contain('1 selection');
    });
  });

  describe('bodyContainer behavior', () => {
    it('renders the menu inline', () => {
      focus(typeahead);
      const menuNode = getMenu(typeahead).instance();
      expect(menuNode.parentNode.nodeName).to.equal('DIV');
    });

    it('appends the menu to the document body', () => {
      typeahead.setProps({bodyContainer: true});
      focus(typeahead);

      const menuNode = getMenu(typeahead).instance();
      expect(menuNode.parentNode.nodeName).to.equal('BODY');
    });
  });

  describe('public methods', () => {
    it('calls the `clear` method', () => {
      let selected = states.slice(0, 1);
      typeahead.setProps({
        onChange: (s) => selected = s,
        selected,
      });

      expect(selected.length).to.equal(1);
      typeahead.instance().getInstance().clear();
      expect(selected.length).to.equal(0);
    });
  });

  describe('clear-on-select behavior', () => {
    let counter, selected, wrapper;

    const onChange = (s) => {
      counter++;
      selected = s;
    };

    class ClearOnSelectTypeahead extends React.Component {
      state = {
        selected: [],
      };

      componentDidMount() {
        expect(this._typeahead).to.exist;
      }

      render() {
        const selected = this.props.controlled ?
          this.state.selected :
          undefined;

        return (
          <Typeahead
            labelKey="name"
            onChange={this._handleChange}
            options={states}
            ref={(t) => this._typeahead = t}
            selected={selected}
          />
        );
      }

      _handleChange = (selected) => {
        this.props.onChange(selected);
        this.props.controlled && this.setState({selected});
        selected.length && this._typeahead.getInstance().clear();
      }
    }

    beforeEach(() => {
      counter = 0;
      selected = [];
    });

    afterEach(() => {
      // Simulate a manual selection.
      focus(wrapper);
      keyDown(wrapper, DOWN);
      keyDown(wrapper, RETURN);

      expect(counter).to.equal(2);
      expect(selected.length).to.equal(0);
      expect(getInput(wrapper).instance().value).to.equal('');
    });

    it('clears an uncontrolled typeahead after selection', () => {
      wrapper = mount(<ClearOnSelectTypeahead onChange={onChange} />);
    });

    it('clears an controlled typeahead after selection', () => {
      wrapper = mount(
        <ClearOnSelectTypeahead
          controlled
          onChange={onChange}
        />
      );
    });
  });

});
