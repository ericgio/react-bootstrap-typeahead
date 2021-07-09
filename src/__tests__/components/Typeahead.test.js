import React, { createRef, forwardRef, useState } from 'react';

import { Menu, MenuItem, Typeahead } from '../..';
import {
  clearTypeahead,
  getInitialState,
  hideMenu,
  toggleMenu,
} from '../../core/Typeahead';

import {
  getHint,
  getInput,
  getItems,
  getMenu,
  getPaginator,
  noop,
  prepareSnapshot,
  render,
  screen,
  fireEvent,
  userEvent,
  waitFor,
  getTokens,
} from '../helpers';

import states from '../data';
import { RETURN, RIGHT, TAB } from '../../constants';

const ID = 'rbt-id';

const TestComponent = forwardRef((props, ref) => (
  <Typeahead
    id={ID}
    labelKey="name"
    onChange={noop}
    options={states}
    ref={ref}
    {...props}
  />
));

const ControlledTestComponent = (props) => {
  const [selected, setSelected] = useState(props.selected);

  return (
    <TestComponent {...props} onChange={setSelected} selected={selected} />
  );
};

describe('<Typeahead> snapshots', () => {
  it('checks the snapshot for a single-select typeahead', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('checks the snapshot for a multi-select typeahead', () => {
    const snapshot = prepareSnapshot(
      <TestComponent multiple selected={states.slice(0, 4)} />
    );
    expect(snapshot).toMatchSnapshot();
  });
});

describe('<Typeahead>', () => {
  it('auto-focuses the typeahead input', () => {
    render(<TestComponent autoFocus />);
    expect(getInput(screen)).toHaveFocus();
  });

  it('sets and unsets the focus state on focus/blur', () => {
    render(<TestComponent />);
    const input = getInput(screen);

    expect(input).not.toHaveFocus();

    input.focus();
    expect(input).toHaveFocus();

    input.blur();
    expect(input).not.toHaveFocus();
  });

  describe('input focus', () => {
    afterEach(() => {
      // The menu should close but the input stays focused.
      expect(getMenu(screen)).not.toBeInTheDocument();
      expect(getInput(screen)).toHaveFocus();
    });

    it('maintains focus when clicking a menu item', () => {
      render(<TestComponent />);
      const input = getInput(screen);
      input.focus();

      // Use fireEvent.click instead of userEvent.click because of weird
      // error about pointer-events being set to "none".
      fireEvent.click(getItems(screen)[0]);
    });

    it('maintains focus when clicking the clear button', () => {
      render(<TestComponent clearButton selected={states.slice(0, 1)} />);

      const input = getInput(screen);
      input.focus();

      // Click the close button
      userEvent.click(screen.getByRole('button'));
    });
  });

  it('truncates selections when using `defaultSelected`', () => {
    let selected = states.slice(0, 4);
    render(
      <TestComponent defaultSelected={selected}>
        {(state) => {
          selected = state.selected;
        }}
      </TestComponent>
    );

    expect(selected).toHaveLength(1);
  });

  describe('behaviors when selections are passed in', () => {
    let selected, selectedText;

    beforeEach(() => {
      selected = states.slice(0, 1);
      selectedText = selected[0].name;
    });

    afterEach(() => {
      const input = getInput(screen);
      input.focus();

      expect(input.value).toBe(selectedText);

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(selectedText);
    });

    it('filters menu options based on `selected` values', () => {
      render(<TestComponent selected={selected} />);
    });

    it('filters menu options based on `defaultSelected` values', () => {
      render(<TestComponent defaultSelected={selected} />);
    });
  });

  it('uses the `filterBy` prop as a callback to filter results', () => {
    const filterBy = jest.fn(
      (option, props) => option.name.indexOf(props.text) > -1
    );

    render(<TestComponent filterBy={filterBy} />);

    const input = getInput(screen);
    userEvent.type(input, 'Cali');

    const items = getItems(screen);

    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('California');
    expect(filterBy).toHaveBeenCalled();
  });

  it('does not filter options when the menu is closed', () => {
    const filterBy = jest.fn();
    render(<TestComponent filterBy={filterBy} open={false} />);

    const input = getInput(screen);
    userEvent.type(input, 'Cali');

    expect(filterBy).not.toHaveBeenCalled();
  });

  describe('menu visibility behavior', () => {
    it('shows the menu on initial render', () => {
      render(<TestComponent defaultOpen />);
      expect(getMenu(screen)).toBeInTheDocument();
    });

    it('shows the menu when `open` is `true`', () => {
      render(<TestComponent open />);
      expect(getMenu(screen)).toBeInTheDocument();
    });

    it('hides the menu when `open` is `false`', () => {
      render(<TestComponent open={false} />);
      getInput(screen).focus();
      expect(getMenu(screen)).not.toBeInTheDocument();
    });

    it('shows the menu when the input is focused', () => {
      render(<TestComponent />);
      getInput(screen).focus();
      expect(getMenu(screen)).toBeInTheDocument();
    });

    it('hides the menu on focus when `minLength=1`', () => {
      render(<TestComponent minLength={1} />);
      getInput(screen).focus();
      expect(getMenu(screen)).not.toBeInTheDocument();
    });

    it('shows the menu when there are no results and `allowNew=true`', () => {
      render(<TestComponent allowNew options={[]} />);

      userEvent.type(getInput(screen), 'xx');

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('New selection: xx');
    });
  });

  it('should disable the input if the component is disabled', () => {
    render(<TestComponent disabled />);
    expect(getInput(screen)).toBeDisabled();
  });

  it('should not highlight disabled options', () => {
    const options = [
      { name: 'foo' },
      { disabled: true, name: 'bar' },
      { disabled: true, name: 'boo' },
      { name: 'baz' },
      { disabled: true, name: 'bro' },
    ];

    render(<TestComponent options={options} />);
    getInput(screen).focus();
    const items = getItems(screen);

    expect(items[1]).toHaveClass('disabled');
    expect(items[2]).toHaveClass('disabled');
    expect(items[4]).toHaveClass('disabled');

    userEvent.keyboard('{arrowdown}');
    expect(items[0]).toHaveClass('active');

    userEvent.keyboard('{arrowdown}');
    expect(items[3]).toHaveClass('active');

    userEvent.keyboard('{arrowup}');
    expect(items[0]).toHaveClass('active');

    userEvent.keyboard('{arrowup}{arrowup}');
    expect(items[3]).toHaveClass('active');
  });

  describe('pagination behaviors', () => {
    let maxResults, onPaginate, shownResultsCount;

    beforeEach(() => {
      maxResults = 10;
      shownResultsCount = maxResults;

      onPaginate = jest.fn((e, shownResults) => {
        shownResultsCount = shownResults;
      });
    });

    it('has a menu item for pagination', () => {
      render(<TestComponent maxResults={10} />);

      getInput(screen).focus();
      const paginator = getPaginator(screen);
      expect(paginator).toHaveTextContent('Display additional results...');
      expect(paginator).toHaveClass('rbt-menu-pagination-option');
    });

    it('triggers the pagination item via mouse or keyboard', () => {
      render(<TestComponent maxResults={maxResults} onPaginate={onPaginate} />);

      getInput(screen).focus();
      const paginator = getPaginator(screen);
      paginator.click();

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);
      expect(getItems(screen)).toHaveLength(21);

      userEvent.keyboard('{arrowup}{enter}');
      expect(onPaginate).toHaveBeenCalledTimes(2);
      expect(shownResultsCount).toBe(maxResults * 3);
      expect(getItems(screen)).toHaveLength(31);
    });

    it('calls `onPaginate` when `labelKey` is a function', () => {
      render(
        <TestComponent
          labelKey={(o) => o.name}
          maxResults={maxResults}
          onPaginate={onPaginate}
        />
      );

      getInput(screen).focus();
      userEvent.keyboard('{arrowup}{enter}');

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);
      expect(getItems(screen)).toHaveLength(21);
    });

    it('displays custom pagination text', () => {
      const paginationText = 'More Results...';
      render(<TestComponent maxResults={10} paginationText={paginationText} />);

      getInput(screen).focus();
      const paginator = getPaginator(screen);

      expect(paginator).toHaveTextContent(paginationText);
    });

    it('does not have a menu item for pagination', () => {
      render(<TestComponent paginate={false} />);
      getInput(screen).focus();
      const paginator = getPaginator(screen);

      expect(paginator).not.toHaveTextContent('Display additional results...');
      expect(paginator).not.toHaveClass('rbt-menu-pagination-option');
    });

    it('resets the shown results when the input value changes', () => {
      maxResults = 5;
      render(<TestComponent maxResults={maxResults} onPaginate={onPaginate} />);

      const input = getInput(screen);
      userEvent.type(input, 'ar');
      userEvent.keyboard('{arrowup}{enter}');

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(maxResults * 2);

      userEvent.clear(input);
      userEvent.type(input, 'or');
      userEvent.keyboard('{arrowup}{enter}');

      expect(onPaginate).toHaveBeenCalledTimes(2);
      expect(shownResultsCount).toBe(maxResults * 2);
    });

    it('updates the active item after pagination', () => {
      render(<TestComponent maxResults={maxResults} />);

      getInput(screen).focus();
      userEvent.keyboard('{arrowup}{enter}');

      const items = getItems(screen);
      expect(items).toHaveLength(21);
      expect(items[maxResults]).toHaveClass('active');
    });
  });

  describe('when `maxResults` is set', () => {
    const maxResults = 5;

    it('should limit results when `paginate=true`', () => {
      render(<TestComponent maxResults={maxResults} />);
      getInput(screen).focus();

      // When `paginate` is true, there will be a pagination menu item in
      // addition to the shown results.
      expect(getItems(screen)).toHaveLength(maxResults + 1);
    });

    it('should limit results when `paginate=false`', () => {
      render(<TestComponent maxResults={maxResults} paginate={false} />);
      getInput(screen).focus();

      expect(getItems(screen)).toHaveLength(maxResults);
    });
  });

  it('renders a large input', () => {
    render(<TestComponent size="large" />);
    expect(getInput(screen)).toHaveClass('form-control-lg');
  });

  it('renders a small input', () => {
    render(<TestComponent size="small" />);
    expect(getInput(screen)).toHaveClass('form-control-sm');
  });

  it('renders a loading indicator', () => {
    render(<TestComponent isLoading />);
    expect(screen.queryByRole('status')).toBeInTheDocument();
  });

  describe('updates when re-rendering with new props', () => {
    it('acts as a controlled input in single-select mode', () => {
      let selected = [];

      const children = (state) => {
        selected = state.selected;
      };
      const selected1 = states.slice(0, 1);
      const selected2 = states.slice(1, 2);

      // Pass in new selection
      const { rerender } = render(
        <TestComponent selected={selected1}>{children}</TestComponent>
      );

      expect(selected).toEqual(selected1);
      expect(getInput(screen)).toHaveValue(selected1[0].name);

      // Pass in another new selection
      rerender(<TestComponent selected={selected2}>{children}</TestComponent>);

      expect(selected).toEqual(selected2);
      expect(getInput(screen)).toHaveValue(selected2[0].name);

      // Clear the selections.
      rerender(<TestComponent selected={[]}>{children}</TestComponent>);

      expect(selected).toEqual([]);
      expect(getInput(screen)).toHaveValue('');
    });

    it('acts as a controlled input in multi-select mode', () => {
      const { container, rerender } = render(
        <TestComponent multiple selected={states.slice(0, 4)} />
      );

      const tokens = getTokens(container);
      const input = getInput(screen);

      expect(tokens).toHaveLength(4);
      expect(input).toHaveValue('');

      // Clear the selections.
      rerender(<TestComponent multiple selected={[]} />);

      expect(tokens).toHaveLength(0);
      expect(input).toHaveValue('');
    });

    it('updates the selections and input value in single-select mode', () => {
      let selected = [];

      render(
        <ControlledTestComponent selected={states.slice(0, 1)}>
          {(state) => {
            selected = state.selected;
          }}
        </ControlledTestComponent>
      );

      const input = getInput(screen);
      expect(selected).toHaveLength(1);
      expect(input).toHaveValue('Alabama');

      // Delete the last character.
      input.focus();
      userEvent.keyboard('{backspace}');

      // Text entry should clear the selection and keep the partial entry.
      expect(selected).toHaveLength(0);
      expect(input).toHaveValue('Alabam');
    });
  });

  describe('`highlightOnlyResult` behavior', () => {
    let onChange, selected;

    beforeEach(() => {
      onChange = jest.fn((s) => (selected = [s]));
      selected = [];
    });

    it('does not highlight the only result', () => {
      render(<TestComponent onChange={onChange} />);

      const input = getInput(screen);
      userEvent.type(input, 'Alab');

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass('active');

      userEvent.keyboard('{enter}');
      expect(selected).toHaveLength(0);
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('highlights the only result', () => {
      render(<TestComponent highlightOnlyResult onChange={onChange} />);

      const input = getInput(screen);
      userEvent.type(input, 'Alab');

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveClass('active');

      userEvent.keyboard('{enter}');
      expect(selected).toHaveLength(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('does not highlight the only result when `allowNew=true`', () => {
      render(
        <TestComponent allowNew highlightOnlyResult onChange={onChange} />
      );

      const input = getInput(screen);
      userEvent.type(input, 'qqq');

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass('active');

      userEvent.keyboard('{enter}');
      expect(selected).toHaveLength(0);
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('does not highlight or select a disabled result', () => {
      render(
        <TestComponent
          highlightOnlyResult
          onChange={onChange}
          options={[
            { name: 'foo' },
            { disabled: true, name: 'bar' },
            { disabled: true, name: 'boo' },
            { name: 'baz' },
          ]}
        />
      );

      const input = getInput(screen);
      userEvent.type(input, 'bar');

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass('active');

      userEvent.keyboard('{enter}');
      expect(selected).toHaveLength(0);
      expect(onChange).toHaveBeenCalledTimes(0);
    });
  });

  it('displays the active item value in the input', () => {
    render(<TestComponent />);

    const input = getInput(screen);
    input.focus();
    userEvent.keyboard('{arrowdown}');

    expect(input.value).toBe('Alabama');
  });

  it('applies custom styles to the top-level container', () => {
    const { container } = render(
      <TestComponent style={{ display: 'inline-flex' }} />
    );

    expect(container.firstChild).toHaveStyle('display: inline-flex');
  });

  describe('input props', () => {
    let input, inputProps;

    beforeEach(() => {
      inputProps = {
        autoComplete: 'nope',
        className: 'input-classname',
        id: 'input-id',
        name: 'input-name',
        onClick: jest.fn(),
        tabIndex: '5',
        type: 'number',
      };
    });

    afterEach(() => {
      userEvent.click(input);
      expect(inputProps.onClick).toHaveBeenCalledTimes(1);

      expect(input).toHaveAttribute('autocomplete', inputProps.autoComplete);
      expect(input).toHaveClass(inputProps.className);
      expect(input).toHaveAttribute('id', inputProps.id);
      expect(input).toHaveAttribute('name', inputProps.name);
      expect(input).toHaveAttribute('tabIndex', inputProps.tabIndex);
      expect(input).toHaveAttribute('type', inputProps.type);
    });

    it('applies the input props single-select mode', () => {
      render(<TestComponent inputProps={inputProps} />);
      input = getInput(screen);
    });

    it('applies the input props in multi-select mode', () => {
      render(
        <TestComponent
          inputProps={inputProps}
          multiple
          selected={states.slice(0, 1)}
        />
      );

      input = screen.getByRole('spinbutton');

      const token = screen.getByRole('button').parentElement;
      expect(token).toHaveAttribute('tabIndex', inputProps.tabIndex);
    });
  });

  it('triggers the `onKeyDown` callback', () => {
    const onKeyDown = jest.fn();

    render(<TestComponent onKeyDown={onKeyDown} />);
    getInput(screen).focus();
    userEvent.keyboard('{enter}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('calls `onMenuToggle`', async () => {
    const onMenuToggle = jest.fn();

    render(<TestComponent onMenuToggle={onMenuToggle} />);
    const input = getInput(screen);

    expect(onMenuToggle).toHaveBeenCalledTimes(0);

    input.focus();
    await waitFor(() => {
      expect(onMenuToggle).toHaveBeenCalledTimes(1);
    });

    // Shouldn't be called again if not hidden first.
    input.focus();
    await waitFor(() => {
      expect(onMenuToggle).toHaveBeenCalledTimes(1);
    });

    userEvent.keyboard('{esc}');
    await waitFor(() => {
      expect(onMenuToggle).toHaveBeenCalledTimes(2);
    });
  });

  describe('hint behavior', () => {
    it('hides and shows the hint in the single-select case', () => {
      const { container } = render(<TestComponent />);

      const input = getInput(screen);
      const hint = getHint(container);

      userEvent.type(input, 'Ala');
      expect(input).toHaveFocus();
      expect(hint).toHaveValue('Alabama');

      input.blur();
      expect(input).not.toHaveFocus();
      expect(hint).toHaveValue('');
    });

    it('hides and shows the hint in the multi-select case', () => {
      const { container } = render(<TestComponent multiple />);

      const input = getInput(screen);
      const hint = getHint(container);

      userEvent.type(input, 'Ala');
      expect(input).toHaveFocus();
      expect(hint).toHaveValue('Alabama');

      input.blur();
      expect(input).not.toHaveFocus();
      expect(hint).toHaveValue('');
    });

    it('does not display a hint if the menu is hidden', () => {
      const { container } = render(<TestComponent />);
      const input = getInput(screen);
      const hint = getHint(container);

      userEvent.type(input, 'Ala');

      // When focused, the typeahead should show the menu and hint text.
      expect(getMenu(screen)).toBeInTheDocument();
      expect(hint).toHaveValue('Alabama');

      userEvent.keyboard('{esc}');

      // Expect the input to remain focused, but the menu and hint to be hidden.
      expect(input).toHaveFocus();
      expect(getMenu(screen)).not.toBeInTheDocument();
      expect(hint).toHaveValue('');
    });
  });

  describe('behavior when selecting the hinted result', () => {
    let keyCode, onChange, onKeyDown;

    beforeEach(() => {
      keyCode = 0;
      onChange = jest.fn();
      onKeyDown = jest.fn((e) => (keyCode = e.keyCode));
    });

    it('should select the hinted result on tab keydown', () => {
      render(<TestComponent onChange={onChange} onKeyDown={onKeyDown} />);

      userEvent.type(getInput(screen), 'Ala');
      userEvent.tab();

      expect(keyCode).toBe(TAB);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should select the hinted result on right arrow keydown', () => {
      render(<TestComponent onChange={onChange} onKeyDown={onKeyDown} />);

      const input = getInput(screen);
      userEvent.type(input, 'Ala');
      userEvent.keyboard('{arrowright}');

      expect(keyCode).toBe(RIGHT);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it(
      'should not select the hinted result on right arrow keydown unless ' +
        'the cursor is at the end of the input value',
      () => {
        render(<TestComponent onChange={onChange} onKeyDown={onKeyDown} />);

        const input = getInput(screen);
        userEvent.type(input, 'Ala');
        input.selectionStart = 1;
        userEvent.keyboard('{arrowright}');

        expect(keyCode).toBe(RIGHT);
        expect(onChange).toHaveBeenCalledTimes(0);
      }
    );

    it('should not select the hinted result on enter keydown', () => {
      render(<TestComponent onChange={onChange} onKeyDown={onKeyDown} />);

      const input = getInput(screen);
      userEvent.type(input, 'Ala');
      userEvent.keyboard('{enter}');

      expect(keyCode).toBe(RETURN);
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('should select the hinted result on enter keydown', () => {
      render(
        <TestComponent
          onChange={onChange}
          onKeyDown={onKeyDown}
          selectHintOnEnter
        />
      );

      const input = getInput(screen);
      userEvent.type(input, 'Ala');
      userEvent.keyboard('{enter}');

      expect(keyCode).toBe(RETURN);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('keydown behaviors with active item', () => {
    let onChange, onKeyDown;

    beforeEach(() => {
      onChange = jest.fn();
      onKeyDown = jest.fn();
    });

    it('selects the active item when pressing return', () => {
      render(<TestComponent onChange={onChange} onKeyDown={onKeyDown} />);

      getInput(screen).focus();
      userEvent.keyboard('{arrowdown}{enter}');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });

    it('does not select the active item when the menu is closed', () => {
      render(
        <TestComponent onChange={onChange} onKeyDown={onKeyDown} open={false} />
      );

      getInput(screen).focus();
      userEvent.keyboard('{arrowdown}{enter}');

      expect(onChange).toHaveBeenCalledTimes(0);
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });
  });

  it('prevents form submission when the menu is open', () => {
    const onSubmit = jest.fn();
    render(
      <form onSubmit={onSubmit}>
        <TestComponent />
        <button type="submit">submit</button>
      </form>
    );

    const input = getInput(screen);
    input.focus();

    userEvent.keyboard('{enter}');
    expect(onSubmit).toHaveBeenCalledTimes(0);

    userEvent.keyboard('{esc}{enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('hides the menu when tabbing out of the input', () => {
    render(<TestComponent />);

    getInput(screen).focus();
    expect(getMenu(screen)).toBeInTheDocument();

    userEvent.tab();
    expect(getMenu(screen)).not.toBeInTheDocument();
  });

  it('calls the keydown handler when a key is pressed', () => {
    const onKeyDown = jest.fn();
    render(<TestComponent onKeyDown={onKeyDown} />);

    userEvent.type(getInput(screen), 'foo');
    expect(onKeyDown).toHaveBeenCalledTimes(3);
  });

  describe('accessibility attributes', () => {
    it('adds an id to the menu for accessibility', () => {
      const { rerender } = render(<TestComponent />);
      const input = getInput(screen);

      expect(input).not.toHaveAttribute('aria-owns');

      input.focus();
      const menu = getMenu(screen);

      expect(menu).toHaveAttribute('id', ID);
      expect(input).toHaveAttribute('aria-owns', ID);

      const id = 'my-id';
      rerender(<TestComponent id={id} />);

      expect(menu).toHaveAttribute('id', id);
      expect(input).toHaveAttribute('aria-owns', id);
    });

    it('sets aria attributes for single-selection', () => {
      render(<TestComponent id="my-id" />);
      const input = getInput(screen);

      expect(input).toHaveAttribute('aria-autocomplete', 'both');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).not.toHaveAttribute('aria-activedescendant');

      input.focus();
      userEvent.keyboard('{arrowdown}');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-activedescendant', 'my-id-item-0');
    });

    it('sets aria attributes for multi-selection', () => {
      render(<TestComponent multiple />);
      const input = getInput(screen);

      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).not.toHaveAttribute('aria-expanded');
    });

    it('sets menu item attributes', () => {
      render(<TestComponent id="my-id" />);

      getInput(screen).focus();
      const item = getItems(screen)[0];

      expect(item).toHaveAttribute('aria-label', 'Alabama');
      expect(item).toHaveAttribute('aria-selected', 'false');
      expect(item).toHaveClass('dropdown-item');

      userEvent.keyboard('{arrowdown}');
      expect(item).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('<Typeahead> multi-select', () => {
    it('displays and removes selections', () => {
      render(<TestComponent multiple selected={states.slice(0, 3)} />);

      // Use close button as a proxy for the token.
      const closeButtons = screen.getAllByRole('button');
      expect(closeButtons).toHaveLength(3);

      userEvent.click(closeButtons[0]);
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('adds selections', () => {
      render(<TestComponent multiple />);

      const input = getInput(screen);
      input.focus();
      userEvent.keyboard('{arrowdown}{enter}');

      expect(screen.getAllByRole('button')).toHaveLength(1);
      expect(input.value).toBe('');
    });
  });

  it('opens the menu when the up or down arrow keys are pressed', () => {
    render(<TestComponent />);

    const input = getInput(screen);

    input.focus();
    expect(getMenu(screen)).toBeInTheDocument();

    userEvent.keyboard('{esc}');
    expect(getMenu(screen)).not.toBeInTheDocument();

    userEvent.keyboard('{arrowdown}');
    expect(getMenu(screen)).toBeInTheDocument();

    userEvent.keyboard('{esc}');
    expect(getMenu(screen)).not.toBeInTheDocument();

    userEvent.keyboard('{arrowup}');
    expect(getMenu(screen)).toBeInTheDocument();
  });

  it('renders a custom input', () => {
    const renderInput = jest.fn();
    render(<TestComponent renderInput={renderInput} />);
    expect(renderInput).toHaveBeenCalled();
  });

  it('renders custom content in the menu items', () => {
    render(
      <TestComponent
        renderMenuItemChildren={
          // Render the capital instead of the state name.
          (o) => o.capital
        }
      />
    );

    getInput(screen).focus();
    expect(getItems(screen)[0]).toHaveTextContent('Montgomery');
  });

  it('renders custom tokens', () => {
    render(
      <TestComponent
        multiple
        renderToken={(option, props, idx) => (
          <div className="custom-token" key={idx}>
            {option.capital}
          </div>
        )}
        selected={states.slice(0, 1)}
      />
    );

    expect(screen.getByText('Montgomery')).toHaveClass('custom-token');
  });

  it('renders children', () => {
    const text = 'This is the child';
    render(
      <TestComponent>
        <div data-testid="children">{text}</div>
      </TestComponent>
    );

    const children = screen.queryByTestId('children');
    expect(children).toBeInTheDocument();
    expect(children).toHaveTextContent(text);
  });

  it('renders children via a render function', () => {
    render(
      <TestComponent>
        {(props) => (
          <div data-testid="children">
            The menu {props.isMenuShown ? 'is' : 'is not'} open
          </div>
        )}
      </TestComponent>
    );

    const children = screen.getByTestId('children');
    expect(children).toHaveTextContent('The menu is not open');

    getInput(screen).focus();
    expect(children).toHaveTextContent('The menu is open');
  });

  describe('validation states', () => {
    it('renders with validation classnames in single-select mode', () => {
      const { rerender } = render(<TestComponent />);

      const input = getInput(screen);
      expect(input).not.toHaveClass('is-invalid');
      expect(input).not.toHaveClass('is-valid');

      rerender(<TestComponent isInvalid isValid />);
      expect(input).toHaveClass('is-invalid');
      expect(input).toHaveClass('is-valid');
    });

    it('renders with validation classnames in multi-select mode', () => {
      const { container, rerender } = render(<TestComponent multiple />);

      const formControl = container.getElementsByClassName('form-control')[0];
      expect(formControl).not.toHaveClass('is-invalid');
      expect(formControl).not.toHaveClass('is-valid');

      rerender(<TestComponent isInvalid isValid multiple />);
      expect(formControl).toHaveClass('is-invalid');
      expect(formControl).toHaveClass('is-valid');
    });
  });

  describe('allowNew behavior', () => {
    let emptyLabel, newSelectionPrefix, value;

    beforeEach(() => {
      emptyLabel = 'No results...';
      newSelectionPrefix = 'New selection: ';
      value = 'xxx';
    });

    it('omits the custom option when `allowNew` is set to `false`', () => {
      render(<TestComponent emptyLabel={emptyLabel} />);

      const input = getInput(screen);
      userEvent.type(input, value);

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(emptyLabel);
    });

    it('adds the custom option when `allowNew` is set to `true`', () => {
      render(
        <TestComponent
          allowNew
          emptyLabel={emptyLabel}
          newSelectionPrefix={newSelectionPrefix}
        />
      );

      const input = getInput(screen);
      userEvent.type(input, value);

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(`${newSelectionPrefix}${value}`);
    });

    it('omits the custom option when there is an exact text match', () => {
      value = 'North Carolina';
      render(<TestComponent allowNew />);

      const input = getInput(screen);
      userEvent.type(input, value);

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(value);
    });

    it('adds a custom option when `allowNew` returns true', () => {
      value = 'North Carolina';

      render(
        <TestComponent
          allowNew={() => true}
          newSelectionPrefix={newSelectionPrefix}
        />
      );

      const input = getInput(screen);
      userEvent.type(input, value);

      const items = getItems(screen);
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent(value);
      expect(items[1]).toHaveTextContent(`${newSelectionPrefix}${value}`);
    });

    it('omits new option when `allowNew` returns false', () => {
      render(<TestComponent allowNew={() => false} emptyLabel={emptyLabel} />);

      const input = getInput(screen);
      userEvent.type(input, value);

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(emptyLabel);
    });

    it('handles custom options when `labelKey` is a function', () => {
      render(
        <TestComponent
          allowNew
          labelKey={(o) => o.name}
          newSelectionPrefix={newSelectionPrefix}
        />
      );

      const input = getInput(screen);
      userEvent.type(input, value);

      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(`${newSelectionPrefix}${value}`);
    });
  });
});

describe('<Typeahead> Public Methods', () => {
  it('exposes the typeahead instance and public methods', () => {
    const ref = createRef();
    render(<TestComponent ref={ref} />);

    ['clear', 'blur', 'focus', 'getInput', 'hideMenu', 'toggleMenu'].forEach(
      (method) => {
        expect(typeof ref.current[method]).toBe('function');
      }
    );
  });

  it('calls the public `focus` and `blur` methods', () => {
    const ref = createRef();
    render(<TestComponent ref={ref} />);

    const input = getInput(screen);

    ref.current.focus();
    expect(input).toHaveFocus();

    ref.current.blur();
    expect(input).not.toHaveFocus();
  });

  it('calls the public `clear` method', () => {
    const ref = createRef();
    const { container } = render(
      <TestComponent multiple ref={ref} selected={states.slice(0, 3)} />
    );

    const input = getInput(screen);
    userEvent.type(input, 'foo');
    const tokens = container.getElementsByClassName('rbt-token');

    expect(tokens).toHaveLength(3);
    expect(input).toHaveValue('foo');

    ref.current.clear();

    expect(tokens).toHaveLength(0);
    expect(input).toHaveValue('');
  });

  it('calls the public `getInput` method', () => {
    const ref = createRef();
    render(<TestComponent ref={ref} />);
    expect(ref.current.getInput()).toEqual(getInput(screen));
  });

  it('calls the public `hideMenu` method', () => {
    const ref = createRef();
    render(<TestComponent ref={ref} />);

    getInput(screen).focus();
    const menu = getMenu(screen);
    expect(menu).toBeInTheDocument();

    ref.current.hideMenu();
    expect(menu).not.toBeInTheDocument();
  });

  it('calls the public `toggleMenu` method', () => {
    const ref = createRef();
    render(<TestComponent ref={ref} />);

    expect(getMenu(screen)).not.toBeInTheDocument();

    ref.current.toggleMenu();
    expect(getMenu(screen)).toBeInTheDocument();

    ref.current.toggleMenu();
    expect(getMenu(screen)).not.toBeInTheDocument();
  });

  it('clears the typeahead after a selection', () => {
    const ref = createRef();
    const onChange = jest.fn(() => {
      ref.current.clear();
    });
    render(<TestComponent onChange={onChange} ref={ref} />);

    const input = getInput(screen);
    input.focus();
    getItems(screen)[0].click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
  });
});

describe('<Typeahead> `change` events', () => {
  let onChange, onInputChange;

  beforeEach(() => {
    onChange = jest.fn();
    onInputChange = jest.fn();
  });

  it('calls `onChange` when a menu item is clicked', () => {
    render(<TestComponent onInputChange={onInputChange} onChange={onChange} />);

    getInput(screen).focus();
    getItems(screen)[0].click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('calls `onChange` when a menu item is selected via keyboard', () => {
    render(<TestComponent onInputChange={onInputChange} onChange={onChange} />);

    getInput(screen).focus();
    userEvent.keyboard('{arrowdown}{enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it(
    'calls `onChange` once when a menu item is selected via keyboard and ' +
      '`selectHintOnEnter={true}`',
    () => {
      render(<TestComponent onChange={onChange} selectHintOnEnter />);

      getInput(screen).focus();
      userEvent.keyboard('{arrowdown}{enter}');

      expect(onChange).toHaveBeenCalledTimes(1);
    }
  );

  it('calls change events when clicking the clear button', () => {
    let event, value;

    onInputChange = jest.fn((v, e) => {
      value = v;
      event = e;
    });

    render(
      <TestComponent
        clearButton
        onChange={onChange}
        onInputChange={onInputChange}
        selected={states.slice(0, 1)}
      />
    );

    screen.getByRole('button').click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(value).toBe('');
    expect(event).toBeDefined();
  });

  it('calls `onInputChange` when text is entered in the input', () => {
    render(<TestComponent onInputChange={onInputChange} />);

    const input = getInput(screen);
    userEvent.type(input, 'z');

    expect(onInputChange).toHaveBeenCalledTimes(1);
  });

  it('`onInputChange` receives an event as the second param', () => {
    let event;
    render(<TestComponent onInputChange={(text, e) => (event = e)} />);

    const input = getInput(screen);
    userEvent.type(input, 'z');

    expect(event).toBeDefined();
  });

  it('calls `onChange` when there is a selection and text is entered', () => {
    const selected = states.slice(0, 1);
    render(
      <TestComponent
        onChange={onChange}
        onInputChange={onInputChange}
        selected={selected}
      />
    );

    const input = getInput(screen);
    userEvent.type(input, 'z');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(1);
  });

  it('does not call either when selections are updated via props', () => {
    const selected = states.slice(0, 1);
    const { rerender } = render(
      <TestComponent onChange={onChange} onInputChange={onInputChange} />
    );

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);

    rerender(
      <TestComponent
        onChange={onChange}
        onInputChange={onInputChange}
        selected={selected}
      />
    );

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('does not call either when `clear()` is called externally', () => {
    const ref = createRef();
    const selected = states.slice(0, 1);
    render(
      <TestComponent
        defaultSelected={selected}
        ref={ref}
        onChange={onChange}
        onInputChange={onInputChange}
      />
    );

    expect(getInput(screen)).toHaveValue(selected[0].name);

    ref.current.clear();

    expect(getInput(screen)).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });
});

describe('<Typeahead> input value behaviors', () => {
  let defaultInputValue, defaultSelected, selected;

  beforeEach(() => {
    defaultInputValue = 'This is a default value';
    defaultSelected = states.slice(0, 1);
    selected = states.slice(0, 1);
  });

  it("doesn't set a value when there is no default value or selection", () => {
    render(<TestComponent selected={[]} />);
    expect(getInput(screen).value).toBe('');
  });

  it('sets an input value based on the `selected` value', () => {
    render(<TestComponent selected={selected} />);
    expect(getInput(screen).value).toBe(selected[0].name);
  });

  it('sets a default initial input value', () => {
    render(<TestComponent defaultInputValue={defaultInputValue} />);
    expect(getInput(screen).value).toBe(defaultInputValue);
  });

  it('sets an input value based on the `defaultSelected` value', () => {
    render(<TestComponent defaultSelected={defaultSelected} />);
    expect(getInput(screen).value).toBe(defaultSelected[0].name);
  });

  it('overrides the default input value if there is a selection', () => {
    render(
      <TestComponent
        defaultInputValue={defaultInputValue}
        selected={selected}
      />
    );
    expect(getInput(screen).value).toBe(selected[0].name);
  });
});

describe('<Typeahead> with clear button', () => {
  it('does not display a clear button', () => {
    render(<TestComponent clearButton selected={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('displays a clear button', () => {
    render(<TestComponent clearButton selected={states.slice(0, 1)} />);
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });
});

/**
 * Some basic tests for the custom menu-rendering use-case.
 * Helps ensure that the context-related logic doesn't break.
 */
describe('<Typeahead> with custom menu', () => {
  const renderMenu = (results, menuProps) => (
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
  );

  it('renders the custom menu', () => {
    render(<TestComponent renderMenu={renderMenu} />);
    getInput(screen).focus();
    expect(getItems(screen)[0]).toHaveTextContent('Wyoming');
  });

  it('shows the correct hint', () => {
    const { container } = render(<TestComponent renderMenu={renderMenu} />);
    const hint = getHint(container);

    userEvent.type(getInput(screen), 'u');

    expect(getItems(screen)[0]).toHaveTextContent('Utah');
    expect(hint).toHaveValue('utah');
  });

  it('selects the correct option', () => {
    const onChange = jest.fn();
    render(<TestComponent onChange={onChange} renderMenu={renderMenu} />);

    const input = getInput(screen);
    input.focus();
    userEvent.keyboard('{arrowdown}');

    const items = getItems(screen);
    expect(items[0]).toHaveTextContent('Wyoming');
    expect(items[0]).toHaveClass('active');

    userEvent.keyboard('{enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('Wyoming');
  });

  // Integration test to ensure that active index updating works correctly when
  // reshuffling the result set.
  it('correctly handles disabled options', () => {
    const options = states.map((state) => {
      return state.name === 'Wyoming' ? { ...state, disabled: true } : state;
    });

    render(<TestComponent options={options} renderMenu={renderMenu} />);

    getInput(screen).focus();
    userEvent.keyboard('{arrowdown}');

    // Keying down should skip over the first option
    const item = getItems(screen)[1];
    expect(item).toHaveClass('active');
    expect(item).toHaveTextContent('Wisconsin');
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
