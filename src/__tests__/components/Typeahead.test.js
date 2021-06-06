import { mount } from 'enzyme';
import { head, noop } from 'lodash';
import React, { createRef } from 'react';
import { Popper } from 'react-popper';

import { Menu, MenuItem, Typeahead } from '../..';
import TypeaheadCore, {
  clearTypeahead,
  getInitialState,
  hideMenu,
  toggleMenu,
} from '../../core/Typeahead';

import {
  change,
  focus,
  getFormControl,
  getHint,
  getInput,
  getMenu,
  getMenuItems,
  getPaginator,
  getTokens,
  isFocused,
  keyDown,
  simulateKeyDown,
} from '../helpers';

import states from '../data';
import { DOWN, ESC, LEFT, RETURN, RIGHT, TAB, UP } from '../../constants';

const ID = 'rbt-id';

function cycleThroughMenuAndGetActiveItem(wrapper, dir) {
  simulateKeyDown(wrapper, dir);
  return wrapper.find('a.active');
}

function mountTypeahead(props) {
  return mount(
    <Typeahead
      id={ID}
      labelKey="name"
      onChange={noop}
      options={states}
      {...props}
    />
  );
}

function getClearButton(wrapper) {
  return wrapper.find('.rbt-close');
}

function getInstance(wrapper) {
  return wrapper.find(TypeaheadCore).instance();
}

function getPlacement(wrapper) {
  return wrapper.find(Popper).prop('placement');
}

function getState(wrapper) {
  return wrapper.find(TypeaheadCore).state();
}

function getSelected(wrapper) {
  return getState(wrapper).selected;
}

function getText(wrapper) {
  return getState(wrapper).text;
}

function hasFocus(wrapper) {
  // Focus state is stored at the top level and propagated down to the input.
  // Check both.
  return (
    getState(wrapper).isFocused && getFormControl(wrapper).hasClass('focus')
  );
}

function makeSelectionViaClick(wrapper) {
  focus(wrapper);
  getMenuItems(wrapper).first().simulate('click');
}

function setCursorPosition(wrapper, pos) {
  const input = getInput(wrapper);
  input.instance().selectionStart = pos;
  input.simulate('change');
}

describe('<Typeahead>', () => {
  let typeahead;

  beforeEach(() => {
    // Test a controlled typeahead by default.
    typeahead = mountTypeahead({ selected: [] });
  });

  it('has an input', () => {
    expect(typeahead.find('input.rbt-input-main')).toHaveLength(1);
  });

  describe('multi-select', () => {
    beforeEach(() => {
      typeahead.setProps({
        multiple: true,
        selected: states.slice(0, 3),
      });
      typeahead.update();
    });

    it('renders in multi-select mode when `multiple=true`', () => {
      expect(typeahead.find('.rbt-input-multi')).toHaveLength(1);
    });

    it('displays and removes selections', () => {
      expect(getTokens(typeahead)).toHaveLength(3);
      getClearButton(typeahead).first().simulate('click');
      expect(getTokens(typeahead)).toHaveLength(2);
    });

    it('adds selections', () => {
      makeSelectionViaClick(typeahead);
      expect(getState(typeahead).text).toBe('');
    });
  });

  // Disable tests that check focus since jsdom no longer supports
  // `document.activeElement`.
  xit('autoFocuses the component on mount', () => {
    typeahead = mountTypeahead({ autoFocus: true });
    expect(isFocused(getInput(typeahead))).toBe(true);
  });

  it('sets and unsets the focus state on focus/blur', () => {
    const input = getInput(typeahead);

    expect(hasFocus(typeahead)).toBe(false);

    input.simulate('focus');
    expect(hasFocus(typeahead)).toBe(true);

    input.simulate('blur');
    expect(hasFocus(typeahead)).toBe(false);
  });

  describe('input focus', () => {
    beforeEach(() => {
      typeahead.setProps({
        clearButton: true,
        selected: states.slice(0, 1),
      });

      focus(typeahead);
      expect(hasFocus(typeahead)).toBe(true);
    });

    afterEach(() => {
      // The menu should close but the input stays focused.
      expect(getMenuItems(typeahead).length).toBe(0);
      expect(hasFocus(typeahead)).toBe(true);
    });

    it('maintains focus when clicking a menu item', () => {
      makeSelectionViaClick(typeahead);
    });

    it('maintains focus when clicking the clear button', () => {
      getClearButton(typeahead).simulate('click');
    });
  });

  describe('behaviors when selections are passed in', () => {
    const multiSelections = states.slice(0, 4);

    it('truncates selections when using `defaultSelected`', () => {
      const wrapper = mountTypeahead({
        defaultSelected: multiSelections,
      });

      expect(getSelected(wrapper).length).toBe(1);
    });

    it('filters menu options based on `selected` values', () => {
      const selected = states.slice(0, 1);
      typeahead.setProps({ selected });

      focus(typeahead);

      expect(getInput(typeahead).prop('value')).toBe(head(selected).name);
      expect(getMenuItems(typeahead).length).toBe(1);
    });

    it('filters menu options based on `defaultSelected` values', () => {
      const defaultSelected = states.slice(0, 1);
      const value = head(defaultSelected).name;

      typeahead = mountTypeahead({ defaultSelected });

      focus(typeahead);

      expect(getInput(typeahead).prop('value')).toBe(value);
      expect(getMenuItems(typeahead).length).toBe(1);
    });
  });

  it('uses the `filterBy` prop as a callback to filter results', () => {
    const filterBy = jest.fn(
      (option, props) => option.name.indexOf(props.text) > -1
    );

    typeahead.setProps({ filterBy });

    change(typeahead, 'Cali');
    focus(typeahead);
    const menuItems = getMenuItems(typeahead);

    expect(menuItems.length).toBe(1);
    expect(menuItems.first().text()).toBe('California');
    expect(filterBy).toHaveBeenCalled();
  });

  it('does not filter options when the menu is closed', () => {
    const filterBy = jest.fn();
    typeahead.setProps({
      filterBy,
      open: false,
    });

    change(typeahead, 'Cali');
    expect(filterBy).not.toHaveBeenCalled();
  });

  describe('menu visibility behavior', () => {
    it('shows the menu on initial render', () => {
      typeahead = mountTypeahead({ defaultOpen: true });
      expect(getState(typeahead).showMenu).toBe(true);
      expect(getMenu(typeahead).length).toBe(1);
    });

    it('shows the menu when `open` is `true`', () => {
      typeahead.setProps({ open: true });

      // TODO: Menu isn't immediately rendered when changing props in testing
      // environment for some reason. For now, test that it at least stays open
      // when blurred.
      focus(typeahead);
      getInput(typeahead).simulate('blur');

      expect(getMenu(typeahead).length).toBe(1);
    });

    it('hides the menu when `open` is `false`', () => {
      typeahead.setProps({ open: false });
      focus(typeahead);
      expect(getMenu(typeahead).length).toBe(0);
    });

    it('shows the menu when the input is focused', () => {
      focus(typeahead);
      expect(getMenu(typeahead).length).toBe(1);
    });

    it('hides the menu on focus when `minLength=1`', () => {
      typeahead.setProps({ minLength: 1 });
      focus(typeahead);
      expect(getMenu(typeahead).length).toBe(0);
    });

    it('shows the menu when there are no results and `allowNew=true`', () => {
      typeahead.setProps({
        allowNew: true,
        options: [],
      });
      change(typeahead, 'xx');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);
      expect(menuItems.length).toBe(1);
      expect(menuItems.text()).toBe('New selection: xx');
    });
  });

  it('should disable the input if the component is disabled', () => {
    typeahead.setProps({ disabled: true });
    const input = getFormControl(typeahead);

    expect(input.prop('disabled')).toBe(true);
  });

  it('should not highlight disabled options', () => {
    let activeItem;

    const options = [
      { name: 'foo' },
      { disabled: true, name: 'bar' },
      { disabled: true, name: 'boo' },
      { name: 'baz' },
    ];

    typeahead = mountTypeahead({ options });
    focus(typeahead);

    // Cycling down should activate the first option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.text()).toBe(options[0].name);

    // Cycling down should skip the two disabled option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.text()).toBe(options[3].name);

    // Cycling back up should again skip the two disabled option.
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, UP);
    expect(activeItem.text()).toBe(options[0].name);

    // Cycle back to the input
    simulateKeyDown(typeahead, DOWN);
    activeItem = cycleThroughMenuAndGetActiveItem(typeahead, DOWN);
    expect(activeItem.length).toBe(0);
  });

  it('should not highlight disabled option which is the last in the list', () => {
    const options = [
      { name: 'foo' },
      { name: 'bar' },
      { disabled: true, name: 'boo' },
    ];

    typeahead = mountTypeahead({ options });
    focus(typeahead);

    // Cycling back up should skip the last option disabled.
    const activeOption = cycleThroughMenuAndGetActiveItem(typeahead, UP);
    expect(activeOption.text()).toBe(options[1].name);
  });

  describe('pagination behaviors', () => {
    let maxResults, onPaginate, shownResultsCount;

    beforeEach(() => {
      maxResults = 10;
      shownResultsCount = maxResults;

      onPaginate = jest.fn((e, shownResults) => {
        shownResultsCount = shownResults;
      });

      typeahead = mountTypeahead({
        maxResults,
        onPaginate,
      });
    });

    it('has a menu item for pagination', () => {
      focus(typeahead);
      const paginator = getPaginator(typeahead);

      expect(paginator).toHaveLength(1);
      expect(paginator.text()).toBe('Display additional results...');
    });

    it('calls `onPaginate` when the menu item is clicked', () => {
      focus(typeahead);
      typeahead
        .find('.rbt-menu-pagination-option a')
        .hostNodes()
        .simulate('click');

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);
      expect(getMenuItems(typeahead).length).toBe(21);
    });

    it('calls `onPaginate` when the return key is pressed', () => {
      focus(typeahead);
      simulateKeyDown(typeahead, UP);
      simulateKeyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);
      expect(getMenuItems(typeahead).length).toBe(21);
    });

    it('calls `onPaginate` when `labelKey` is a function', () => {
      typeahead.setProps({ labelKey: (o) => o.name });

      focus(typeahead);
      simulateKeyDown(typeahead, UP);
      simulateKeyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);
      expect(getMenuItems(typeahead).length).toBe(21);
    });

    it('displays custom pagination text', () => {
      const paginationText = 'More Results...';
      typeahead.setProps({ paginationText });

      focus(typeahead);
      expect(getPaginator(typeahead).text()).toBe(paginationText);
    });

    it('does not have a menu item for pagination', () => {
      typeahead.setProps({ paginate: false });

      focus(typeahead);
      expect(getPaginator(typeahead)).toHaveLength(0);
    });

    it('resets the shown results when the input value changes', () => {
      maxResults = 5;
      typeahead.setProps({ maxResults });

      change(typeahead, 'ar');
      focus(typeahead);
      simulateKeyDown(typeahead, UP);
      simulateKeyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);

      change(typeahead, 'or');
      focus(typeahead);
      simulateKeyDown(typeahead, UP);
      simulateKeyDown(typeahead, RETURN);

      expect(onPaginate).toHaveBeenCalledTimes(2);
      expect(shownResultsCount).toBe(maxResults * 2);
    });

    it('updates the active item after pagination', () => {
      focus(typeahead);
      simulateKeyDown(typeahead, UP);

      const { activeItem } = getState(typeahead);
      expect(activeItem.paginationOption).toBe(true);

      simulateKeyDown(typeahead, RETURN);
      expect(getState(typeahead).activeItem).toEqual(states[maxResults]);
    });
  });

  describe('should limit the results when `maxResults` is set', () => {
    const maxResults = 5;

    beforeEach(() => {
      typeahead = mountTypeahead({ maxResults });
    });

    it('should limit results when `paginate=true`', () => {
      focus(typeahead);

      // When `paginate` is true, there will be a pagination menu item in
      // addition to the shown results.
      expect(getMenuItems(typeahead).length).toBe(maxResults + 1);
    });

    it('should limit results when `paginate=false`', () => {
      typeahead.setProps({ paginate: false });
      focus(typeahead);

      expect(getMenuItems(typeahead).length).toBe(maxResults);
    });
  });

  it("changes the menu's horizontal positioning", () => {
    focus(typeahead);

    expect(getPlacement(typeahead)).toBe('bottom-start');

    typeahead.setProps({ align: 'right' });
    expect(getPlacement(typeahead)).toBe('bottom-end');

    typeahead.setProps({ align: 'left' });
    expect(getPlacement(typeahead)).toBe('bottom-start');
  });

  it('should position the menu above the input when `dropup=true`', () => {
    typeahead.setProps({ dropup: true });
    focus(typeahead);

    expect(getPlacement(typeahead)).toBe('top-start');
  });

  it('renders a large input', () => {
    typeahead.setProps({ size: 'large' });
    const input = getFormControl(typeahead);

    expect(input.hasClass('form-control-lg')).toBe(true);
  });

  it('renders a small input', () => {
    typeahead.setProps({ size: 'small' });
    const input = getFormControl(typeahead);

    expect(input.hasClass('form-control-sm')).toBe(true);
  });

  it('renders a loading indicator', () => {
    typeahead.setProps({ isLoading: true });
    expect(typeahead.find('.rbt-loader')).toHaveLength(1);
  });

  describe('updates when re-rendering with new props', () => {
    it('acts as a controlled input in single-select mode', () => {
      const selected1 = states.slice(0, 1);
      const selected2 = states.slice(1, 2);

      // Pass in new selection
      typeahead.setProps({ selected: selected1 });

      expect(getSelected(typeahead)).toEqual(selected1);
      expect(getText(typeahead)).toBe(head(selected1).name);

      // Pass in another new selection
      typeahead.setProps({ selected: selected2 });

      expect(getSelected(typeahead)).toEqual(selected2);
      expect(getText(typeahead)).toBe(head(selected2).name);

      // Clear the selections.
      typeahead.setProps({ selected: [] });

      expect(getSelected(typeahead)).toEqual([]);
      expect(getText(typeahead)).toBe('');
    });

    it('acts as a controlled input in multi-select mode', () => {
      const selected1 = states.slice(0, 4);

      // Pass in new selection
      typeahead.setProps({
        multiple: true,
        selected: selected1,
      });

      expect(getSelected(typeahead)).toEqual(selected1);
      expect(getText(typeahead)).toBe('');

      // Clear the selections.
      typeahead.setProps({ selected: [] });

      expect(getSelected(typeahead)).toEqual([]);
      expect(getText(typeahead)).toBe('');
    });

    it('updates the selections and input value in single-select mode', () => {
      typeahead.setProps({
        // Simulate a controlled component.
        onChange: (selected) => typeahead.setProps({ selected }),
        selected: states.slice(0, 1),
      });

      expect(getSelected(typeahead).length).toBe(1);
      expect(getText(typeahead)).toBe('Alabama');

      // Simulate deleting the last character.
      change(typeahead, 'Alabam');

      // Text entry should clear the selection and keep the entry.
      expect(getSelected(typeahead).length).toBe(0);
      expect(getText(typeahead)).toBe('Alabam');
    });
  });

  describe('`highlightOnlyResult` behavior', () => {
    let selected;

    beforeEach(() => {
      selected = [];
      typeahead = mountTypeahead({
        onChange: (s) => (selected = [s]),
      });
    });

    it('does not highlight the only result', () => {
      change(typeahead, 'Alab');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.hasClass('active')).toBe(false);

      simulateKeyDown(typeahead, RETURN);

      expect(selected.length).toBe(0);
    });

    it('highlights the only result', () => {
      typeahead.setProps({ highlightOnlyResult: true });

      change(typeahead, 'Alab');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.hasClass('active')).toBe(true);

      simulateKeyDown(typeahead, RETURN);

      expect(selected.length).toBe(1);
    });

    it('does not highlight the only result when `allowNew=true`', () => {
      typeahead.setProps({
        allowNew: true,
        highlightOnlyResult: true,
      });

      change(typeahead, 'qqq');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.hasClass('active')).toBe(false);

      simulateKeyDown(typeahead, RETURN);

      expect(selected.length).toBe(0);
    });

    it('does not highlight or select a disabled result', () => {
      typeahead.setProps({
        highlightOnlyResult: true,
        options: [
          { name: 'foo' },
          { disabled: true, name: 'bar' },
          { disabled: true, name: 'boo' },
          { name: 'baz' },
        ],
      });

      change(typeahead, 'bar');
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.hasClass('active')).toBe(false);

      simulateKeyDown(typeahead, RETURN);

      expect(selected.length).toBe(0);
    });
  });

  it('displays the active item value in the input', () => {
    focus(typeahead);
    simulateKeyDown(typeahead, DOWN);

    expect(getInput(typeahead).prop('value')).toBe('Alabama');
  });

  it('applies custom styles to the top-level container', () => {
    typeahead.setProps({ style: { display: 'inline-flex' } });

    expect(typeahead.find('div').first().prop('style').display).toEqual(
      'inline-flex'
    );
  });

  describe('applies attributes to the input', () => {
    let inputProps;

    beforeEach(() => {
      inputProps = {
        autoComplete: 'nope',
        className: 'input-classname',
        id: 'input-id',
        name: 'input-name',
        tabIndex: 5,
        type: 'number',
      };

      typeahead.setProps({ inputProps });
    });

    afterEach(() => {
      const props = getInput(typeahead).props();

      expect(props.autoComplete).toBe(inputProps.autoComplete);
      expect(props.className).toMatch(inputProps.className);
      expect(props.id).toBe(inputProps.id);
      expect(props.name).toBe(inputProps.name);
      expect(props.tabIndex).toBe(inputProps.tabIndex);
      expect(props.type).toBe(inputProps.type);
    });

    it('in single-select mode', () => {
      // Continue to `afterEach`
    });

    it('in multi-select mode', () => {
      typeahead.setProps({
        multiple: true,
        selected: states.slice(0, 1),
      });
      typeahead.update();

      expect(getTokens(typeahead).prop('tabIndex')).toBe(inputProps.tabIndex);
    });
  });

  it('triggers the `onKeyDown` callback', () => {
    const onKeyDown = jest.fn();

    typeahead.setProps({ onKeyDown });
    simulateKeyDown(typeahead, RETURN);

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('calls `onMenuToggle`', () => {
    const onMenuToggle = jest.fn();

    typeahead.setProps({ onMenuToggle });

    expect(onMenuToggle).toHaveBeenCalledTimes(0);

    focus(typeahead);
    expect(onMenuToggle).toHaveBeenCalledTimes(1);

    // Shouldn't be called again if not hidden first.
    focus(typeahead);
    expect(onMenuToggle).toHaveBeenCalledTimes(1);

    simulateKeyDown(typeahead, ESC);
    expect(onMenuToggle).toHaveBeenCalledTimes(2);
  });

  describe('hint behavior', () => {
    beforeEach(() => {
      typeahead = mountTypeahead({ defaultInputValue: 'Ala' });
    });

    it('does not display a hint when the input is not focused', () => {
      expect(hasFocus(typeahead)).toBe(false);
      expect(getHint(typeahead)).toBe('');
    });

    it('displays a hint when the input is focused', () => {
      focus(typeahead);
      expect(getHint(typeahead)).toBe('Alabama');
    });

    it('displays a hint in multi-select mode', () => {
      typeahead.setProps({ multiple: true });

      change(typeahead, 'Ala');
      focus(typeahead);

      expect(getHint(typeahead)).toBe('Alabama');
    });

    it('does not display a hint if the menu is hidden', () => {
      focus(typeahead);

      // When focused, the typeahead should show the menu and hint text.
      expect(getMenu(typeahead).length).toBe(1);
      expect(getHint(typeahead)).toBe('Alabama');

      simulateKeyDown(typeahead, ESC);

      // Expect the input to remain focused, but the menu and hint to be hidden.
      expect(hasFocus(typeahead)).toBe(true);
      expect(getMenu(typeahead).length).toBe(0);
      expect(getHint(typeahead)).toBe('');
    });
  });

  describe('behavior when selecting the hinted result', () => {
    let keyCode;

    beforeEach(() => {
      keyCode = 0;

      typeahead.setProps({
        onKeyDown: (e) => (keyCode = e.keyCode),
      });

      change(typeahead, 'Ala');
      focus(typeahead);
    });

    it('should select the hinted result on tab keydown', () => {
      keyDown(typeahead, TAB);

      expect(keyCode).toBe(TAB);
      expect(getSelected(typeahead).length).toBe(1);
    });

    it('should select the hinted result on right arrow keydown', () => {
      setCursorPosition(typeahead, getText(typeahead).length);
      keyDown(typeahead, RIGHT);

      expect(keyCode).toBe(RIGHT);
      expect(getSelected(typeahead).length).toBe(1);
    });

    it(
      'should not select the hinted result on right arrow keydown unless ' +
        'the cursor is at the end of the input value',
      () => {
        setCursorPosition(typeahead, 1);
        simulateKeyDown(typeahead, RIGHT);

        expect(keyCode).toBe(RIGHT);
        expect(getSelected(typeahead).length).toBe(0);
      }
    );

    it('should not select the hinted result on enter keydown', () => {
      simulateKeyDown(typeahead, RETURN);

      expect(keyCode).toBe(RETURN);
      expect(getSelected(typeahead).length).toBe(0);
    });

    it('should select the hinted result on enter keydown', () => {
      typeahead.setProps({ selectHintOnEnter: true });
      keyDown(typeahead, RETURN);

      expect(keyCode).toBe(RETURN);
      expect(getSelected(typeahead).length).toBe(1);
    });
  });

  describe('keydown behaviors with active item', () => {
    let onKeyDown;

    beforeEach(() => {
      onKeyDown = jest.fn();

      typeahead.setProps({
        onKeyDown,
      });

      // Focus and navigate to the first result.
      focus(typeahead);
      simulateKeyDown(typeahead, DOWN);
      expect(getSelected(typeahead).length).toBe(0);
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it('selects the active item when pressing return', () => {
      keyDown(typeahead, RETURN);
      expect(getSelected(typeahead).length).toBe(1);
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });

    it('does not select the active item when the menu is closed', () => {
      typeahead.setProps({ open: false });
      simulateKeyDown(typeahead, RIGHT);
      expect(getSelected(typeahead).length).toBe(0);
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });
  });

  describe('form submission', () => {
    let preventDefault;

    beforeEach(() => {
      preventDefault = jest.fn();
    });

    it('prevents form submission when the menu is open', () => {
      focus(typeahead);
      keyDown(typeahead, RETURN, { preventDefault });

      expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it('allows form submission when the menu is closed', () => {
      focus(typeahead);
      keyDown(typeahead, ESC); // Close the menu
      keyDown(typeahead, RETURN, { preventDefault });

      expect(preventDefault).toHaveBeenCalledTimes(0);
    });
  });

  it('hides the menu when tabbing out of the input', () => {
    focus(typeahead);
    expect(getState(typeahead).showMenu).toBe(true);

    simulateKeyDown(typeahead, TAB);
    expect(getState(typeahead).showMenu).toBe(false);
  });

  it('calls the keydown handler when a key is pressed', () => {
    const onKeyDown = jest.fn();

    typeahead.setProps({
      onKeyDown,
    });

    focus(typeahead);
    simulateKeyDown(typeahead, LEFT);

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  describe('accessibility attributes', () => {
    it('adds an id to the menu for accessibility', () => {
      expect(getInput(typeahead).prop('aria-owns')).toBe(undefined);

      focus(typeahead);

      expect(getMenu(typeahead).prop('id')).toBe(ID);
      expect(getInput(typeahead).prop('aria-owns')).toBe(ID);

      const id = 'my-id';
      typeahead.setProps({ id });

      expect(getMenu(typeahead).prop('id')).toBe(id);
      expect(getInput(typeahead).prop('aria-owns')).toBe(id);
    });

    it('sets the input `role`', () => {
      // Single-select
      expect(getInput(typeahead).prop('role')).toBe('combobox');

      // Multi-select
      typeahead.setProps({ multiple: true });
      expect(getInput(typeahead).prop('role')).toBeUndefined();
    });

    it('sets the input `aria-autocomplete` description', () => {
      // Single-select
      expect(getInput(typeahead).prop('aria-autocomplete')).toBe('both');

      // Multi-select
      typeahead.setProps({ multiple: true });
      expect(getInput(typeahead).prop('aria-autocomplete')).toBe('list');
    });

    it('sets the input `aria-expanded` description', () => {
      // Single-select
      expect(getInput(typeahead).prop('aria-expanded')).toBe(false);

      focus(typeahead);
      expect(getInput(typeahead).prop('aria-expanded')).toBe(true);

      // Multi-select
      typeahead.setProps({ multiple: true });
      expect(getInput(typeahead).prop('aria-expanded')).toBeUndefined();
    });

    it('sets the input `aria-activedescendant` description', () => {
      typeahead.setProps({ id: 'my-id' });
      expect(getInput(typeahead).prop('aria-activedescendant')).toBe(undefined);

      focus(typeahead);
      simulateKeyDown(typeahead, DOWN);

      expect(getInput(typeahead).prop('aria-activedescendant')).toBe(
        'my-id-item-0'
      );
    });

    it('sets menu item attributes', () => {
      focus(typeahead);

      const menuItem = typeahead.find('.dropdown-item').first();
      expect(menuItem.prop('aria-label')).toBe('Alabama');
      expect(menuItem.prop('aria-selected')).toBe(false);
      expect(menuItem.prop('role')).toBe('option');

      simulateKeyDown(typeahead, DOWN);
      expect(
        typeahead.find('.dropdown-item').first().prop('aria-selected')
      ).toBe(true);
    });
  });

  describe('Public Methods', () => {
    let instance;

    beforeEach(() => {
      const ref = createRef();
      typeahead = mountTypeahead({ ref });
      instance = ref.current;
    });

    it('exposes the typeahead instance and public methods', () => {
      ['clear', 'blur', 'focus', 'getInput', 'hideMenu', 'toggleMenu'].forEach(
        (method) => {
          expect(typeof instance[method]).toBe('function');
        }
      );
    });

    it('calls the public `blur` method', () => {
      focus(typeahead);
      expect(getState(typeahead).showMenu).toBe(true);

      instance.blur();

      expect(getState(typeahead).showMenu).toBe(false);
    });

    it('calls the public `clear` method', () => {
      typeahead.setProps({ selected: states.slice(0, 1) });

      expect(getSelected(typeahead).length).toBe(1);
      expect(getText(typeahead)).toBe('Alabama');

      instance.clear();

      expect(getSelected(typeahead).length).toBe(0);
      expect(getText(typeahead)).toBe('');
    });

    it('calls the public `getInput` method', () => {
      const inputNode = instance.getInput();

      expect(inputNode).toBe(getInput(typeahead).getDOMNode());
    });

    it('calls the public `hideMenu` method', () => {
      focus(typeahead);
      expect(getState(typeahead).showMenu).toBe(true);

      instance.hideMenu();

      expect(getState(typeahead).showMenu).toBe(false);
    });

    it('calls the public `hideMenu` method', () => {
      expect(getState(typeahead).showMenu).toBe(false);

      instance.toggleMenu();
      expect(getState(typeahead).showMenu).toBe(true);

      instance.toggleMenu();
      expect(getState(typeahead).showMenu).toBe(false);
    });

    it('clears the typeahead after a selection', () => {
      const onChange = jest.fn((selected) => {
        instance.clear();
      });

      typeahead.setProps({ onChange });

      makeSelectionViaClick(typeahead);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(getSelected(typeahead).length).toBe(0);
      expect(getText(typeahead)).toBe('');
    });
  });

  it('opens the menu when the up or down arrow keys are pressed', () => {
    focus(typeahead);
    expect(getState(typeahead).showMenu).toBe(true);

    simulateKeyDown(typeahead, ESC);
    expect(getState(typeahead).showMenu).toBe(false);

    simulateKeyDown(typeahead, DOWN);
    expect(getState(typeahead).showMenu).toBe(true);

    simulateKeyDown(typeahead, ESC);
    expect(getState(typeahead).showMenu).toBe(false);

    simulateKeyDown(typeahead, UP);
    expect(getState(typeahead).showMenu).toBe(true);
  });

  it('renders a custom input', () => {
    const renderInput = jest.fn();
    typeahead.setProps({ renderInput });
    expect(renderInput).toHaveBeenCalledTimes(1);
  });

  it('renders custom content in the menu items', () => {
    typeahead.setProps({
      // Render the capital instead of the state name.
      renderMenuItemChildren: (option, props) => option.capital,
    });

    focus(typeahead);
    expect(getMenuItems(typeahead).first().text()).toBe('Montgomery');
  });

  it('renders custom tokens', () => {
    typeahead.setProps({
      multiple: true,
      renderToken: (option, props, idx) => (
        <div className="custom-token" key={idx}>
          {option.capital}
        </div>
      ),
      selected: states.slice(0, 1),
    });
    typeahead.update();

    expect(typeahead.find('.custom-token').text()).toBe('Montgomery');
  });

  it('renders children', () => {
    const text = 'This is the child';
    const children = <div className="children">{text}</div>;

    typeahead.setProps({ children });

    expect(typeahead.find('.children').text()).toBe(text);
  });

  it('renders children via a render function', () => {
    const children = (props) => (
      <div className="children">
        The menu {props.isMenuShown ? 'is' : 'is not'} open
      </div>
    );

    typeahead.setProps({ children });

    expect(typeahead.find('.children').text()).toBe('The menu is not open');

    focus(typeahead);

    expect(typeahead.find('.children').text()).toBe('The menu is open');
  });

  describe('validation states', () => {
    beforeEach(() => {
      const input = getFormControl(typeahead);

      expect(input.hasClass('is-invalid')).toBe(false);
      expect(input.hasClass('is-valid')).toBe(false);
    });

    afterEach(() => {
      typeahead.setProps({
        isInvalid: true,
        isValid: true,
      });

      const input = getFormControl(typeahead);

      expect(input.hasClass('is-invalid')).toBe(true);
      expect(input.hasClass('is-valid')).toBe(true);
    });

    it('renders with validation classnames in single-select mode', () => {
      typeahead.setProps({ multiple: false });
    });

    it('renders with validation classnames in multi-select mode', () => {
      typeahead.setProps({ multiple: true });
    });
  });

  describe('allowNew behavior', () => {
    let emptyLabel, newSelectionPrefix, text;

    beforeEach(() => {
      emptyLabel = 'No results...';
      newSelectionPrefix = 'New selection: ';
      text = 'xxx';

      typeahead.setProps({
        allowNew: true,
        emptyLabel,
        newSelectionPrefix,
      });
    });

    it('omits the custom option when `allowNew` is set to `false`', () => {
      typeahead.setProps({
        allowNew: false,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.at(0).text()).toBe(emptyLabel);
    });

    it('adds the custom option when `allowNew` is set to `true`', () => {
      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.at(0).text()).toBe(`${newSelectionPrefix}${text}`);

      // Highlight and select the custom option.
      simulateKeyDown(typeahead, DOWN);
      simulateKeyDown(typeahead, RETURN);

      expect(getSelected(typeahead)[0].id).toMatch('new-id-');
    });

    it('omits the custom option when there is an exact text match', () => {
      text = 'North Carolina';

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.at(0).text()).toBe(text);
    });

    it('adds a custom option when `allowNew` returns true', () => {
      text = 'North Carolina';

      typeahead.setProps({
        allowNew: (results, props) => true,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(2);
      expect(menuItems.at(0).text()).toBe(text);
      expect(menuItems.at(1).text()).toBe(`${newSelectionPrefix}${text}`);
    });

    it('omits new option when `allowNew` returns false', () => {
      text = 'North Carolina';

      typeahead.setProps({
        allowNew: (results, props) => false,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.at(0).text()).toBe(text);
    });

    it('handles custom options when `labelKey` is a function', () => {
      typeahead.setProps({
        labelKey: (o) => o.name,
      });

      change(typeahead, text);
      focus(typeahead);

      const menuItems = getMenuItems(typeahead);

      expect(menuItems.length).toBe(1);
      expect(menuItems.at(0).text()).toBe(`${newSelectionPrefix}${text}`);
    });
  });
});

describe('<Typeahead> `change` events', () => {
  let onChange, onInputChange, selected, wrapper;

  beforeEach(() => {
    onChange = jest.fn();
    onInputChange = jest.fn();
    selected = states.slice(0, 1);

    wrapper = mountTypeahead({
      onChange,
      onInputChange,
      selected: [],
    });

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('calls `onChange` when a menu item is clicked', () => {
    focus(wrapper);
    getMenuItems(wrapper).first().simulate('click');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('calls `onChange` when a menu item is selected via keyboard', () => {
    focus(wrapper);
    simulateKeyDown(wrapper, DOWN);
    simulateKeyDown(wrapper, RETURN);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it(
    'calls `onChange` once when a menu item is selected via keyboard and ' +
      '`selectHintOnEnter={true}`',
    () => {
      wrapper.setProps({ selectHintOnEnter: true });

      focus(wrapper);
      simulateKeyDown(wrapper, DOWN);
      simulateKeyDown(wrapper, RETURN);

      expect(onChange).toHaveBeenCalledTimes(1);
    }
  );

  it('retains focus on the clear button', () => {
    const stopPropagation = jest.fn();

    wrapper = mountTypeahead({
      clearButton: true,
      selected,
    });

    getClearButton(wrapper).simulate('focus', { stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('calls `onChange` when clicking the clear button', () => {
    wrapper = mountTypeahead({
      clearButton: true,
      onChange,
      onInputChange,
      selected,
    });

    getClearButton(wrapper).simulate('click');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('calls `onInputChange` when text is entered in the input', () => {
    focus(wrapper);
    change(wrapper, 'z');
    expect(onInputChange).toHaveBeenCalledTimes(1);
  });

  it('`onInputChange` receives an event as the second param', () => {
    let event;

    wrapper.setProps({
      onInputChange: (text, e) => (event = e),
    });

    focus(wrapper);
    change(wrapper, 'z');

    expect(event).toBeDefined();
  });

  it('calls `onChange` when there is a selection and text is entered', () => {
    wrapper.setProps({ selected });

    expect(getSelected(wrapper).length).toBe(1);

    focus(wrapper);
    change(wrapper, 'z');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(getSelected(wrapper).length).toBe(0);
  });

  it('does not call either when selections are updated via props', () => {
    expect(getSelected(wrapper)).toEqual([]);

    wrapper.setProps({ selected });

    expect(getSelected(wrapper)).toEqual(selected);
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('does not call either when `clear()` is called externally', () => {
    wrapper = mountTypeahead({
      defaultSelected: selected,
    });

    expect(getSelected(wrapper).length).toBe(1);
    expect(getText(wrapper)).toBe(head(selected).name);

    getInstance(wrapper).clear();

    expect(getSelected(wrapper).length).toBe(0);
    expect(getText(wrapper)).toBe('');
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });
});

describe('<Typeahead> input value behaviors', () => {
  let defaultInputValue, defaultSelected, selected, wrapper;

  beforeEach(() => {
    defaultInputValue = 'This is a default value';
    defaultSelected = states.slice(0, 1);
    selected = states.slice(0, 1);
  });

  it('sets an input value based on the `selected` value', () => {
    wrapper = mountTypeahead({ selected: [] });
    expect(getText(wrapper)).toBe('');

    wrapper.setProps({ selected });
    expect(getText(wrapper)).toBe(head(selected).name);
  });

  it('sets a default initial input value', () => {
    wrapper = mountTypeahead({ defaultInputValue });
    expect(getInput(wrapper).prop('value')).toBe(defaultInputValue);
  });

  it('sets an input value based on the `defaultSelected` value', () => {
    wrapper = mountTypeahead({ defaultSelected });
    const inputValue = getInput(wrapper).prop('value');
    expect(inputValue).toBe(head(defaultSelected).name);
  });

  it('overrides the initial input value', () => {
    wrapper = mountTypeahead({ defaultInputValue, selected });
    expect(getInput(wrapper).prop('value')).toBe(head(selected).name);
  });
});

describe('<Typeahead> with clear button', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountTypeahead({
      clearButton: true,
      selected: [],
    });
  });

  it('does not display a clear button', () => {
    // Doesn't display since there are no selections.
    expect(getClearButton(wrapper).length).toBe(0);
  });

  it('displays a clear button', () => {
    wrapper.setProps({ selected: states.slice(0, 1) });
    wrapper.update();

    expect(getClearButton(wrapper).length).toBe(1);
  });
});

/**
 * Some basic tests for the custom menu-rendering use-case.
 * Helps ensure that the context-related logic doesn't break.
 */
describe('<Typeahead> with custom menu', () => {
  let wrapper;

  beforeEach(() => {
    // Render a menu with states in reverse alphabetical order.
    wrapper = mountTypeahead({
      renderMenu: (results, menuProps) => (
        <Menu {...menuProps}>
          {/* Use `slice` to avoid mutating the original array */}
          {results
            .slice()
            .reverse()
            .map((r, index) => (
              <MenuItem key={r.name} option={r} position={index}>
                {r.name}
              </MenuItem>
            ))}
        </Menu>
      ),
    });
  });

  it('renders the custom menu', () => {
    focus(wrapper);

    // Make sure the rendered menu and the internal state agree.
    expect(getState(wrapper).initialItem.name).toBe('Wyoming');
    expect(getMenuItems(wrapper).first().text()).toBe('Wyoming');
  });

  it('shows the correct hint', () => {
    change(wrapper, 'u');
    focus(wrapper); // Focus needs to come after change.

    expect(getMenuItems(wrapper).first().text()).toBe('Utah');
    expect(getHint(wrapper)).toBe('utah');
  });

  it('selects the correct option', () => {
    focus(wrapper);
    simulateKeyDown(wrapper, DOWN);

    expect(getState(wrapper).activeItem.name).toBe('Wyoming');

    simulateKeyDown(wrapper, RETURN);
    expect(getSelected(wrapper)[0].name).toBe('Wyoming');
  });

  // Integration test to ensure that active index updating works correctly when
  // reshuffling the result set.
  it('correctly handles disabled options', () => {
    // Disable the first option.
    const options = states.map((state) => {
      return state.name === 'Wyoming' ? { ...state, disabled: true } : state;
    });

    wrapper.setProps({ options });

    focus(wrapper);
    simulateKeyDown(wrapper, DOWN);

    expect(getState(wrapper).activeItem.name).toBe('Wisconsin');
  });
});

describe('State modifiers', () => {
  const defaultState = {
    activeIndex: -1,
    activeItem: null,
    initialItem: null,
    isFocused: false,
    selected: [],
    showMenu: false,
    text: '',
  };

  it('calls the clearTypeahead modifier', () => {
    const props = {
      defaultOpen: false,
      defaultSelected: [],
      maxResults: 10,
    };

    const state = {
      isFocused: true,
    };

    expect(clearTypeahead(state, props)).toEqual({
      ...defaultState,
      isFocused: true,
      shownResults: 10,
    });
  });

  it('calls the getInitialState modifier', () => {
    expect(
      getInitialState({
        defaultInputValue: 'foo',
        defaultOpen: false,
        defaultSelected: [],
        maxResults: 10,
      })
    ).toEqual({
      ...defaultState,
      shownResults: 10,
      text: 'foo',
    });

    expect(
      getInitialState({
        defaultInputValue: 'foo',
        defaultOpen: true,
        defaultSelected: ['bar', 'foo'],
        maxResults: 10,
      })
    ).toEqual({
      ...defaultState,
      selected: ['bar'],
      showMenu: true,
      shownResults: 10,
      text: 'bar',
    });
  });

  it('calls the hideMenu modifier', () => {
    const props = {
      defaultSelected: [],
      maxResults: 10,
    };

    expect(hideMenu({}, props)).toEqual({
      activeIndex: -1,
      activeItem: null,
      initialItem: null,
      showMenu: false,
      shownResults: props.maxResults,
    });
  });

  it('calls the toggleMenu modifier', () => {
    const props = {
      defaultSelected: [],
      maxResults: 10,
    };

    expect(toggleMenu({ showMenu: false })).toEqual({
      showMenu: true,
    });

    expect(toggleMenu({ showMenu: true }, props)).toEqual({
      activeIndex: -1,
      activeItem: null,
      initialItem: null,
      showMenu: false,
      shownResults: props.maxResults,
    });
  });
});
