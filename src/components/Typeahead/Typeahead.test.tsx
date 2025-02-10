import React, { createRef, forwardRef, ReactNode } from 'react';

import TypeaheadComponent, { TypeaheadComponentProps } from './Typeahead';

import * as stories from './Typeahead.stories';

import {
  composeStories,
  findItems,
  findMenu,
  findPaginator,
  generateSnapshots,
  getHint,
  getInput,
  getItems,
  getMenu,
  getTokens,
  noop,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../tests/helpers';

import states, { Option } from '../../tests/data';

const ID = 'rbt-id';

const inputProps = {
  autoComplete: 'nope',
  className: 'input-classname',
  id: 'input-id',
  name: 'input-name',
  onClick: noop,
  tabIndex: 5,
  type: 'number',
};

const TestComponent = forwardRef<Typeahead, Partial<TypeaheadComponentProps>>(
  (props, ref) => (
    <TypeaheadComponent
      id={ID}
      labelKey="name"
      onChange={noop}
      options={states}
      ref={ref}
      {...props}
    />
  )
);

const {
  Default,
  MultiSelect,
  ClearButton,
  InputValidation,
  Pagination,
  AllowNew,
  DisabledItem,
  CustomMenu,
  Controlled,
} = composeStories(stories);

describe('<Typeahead>', () => {
  generateSnapshots(stories);

  it('auto-focuses the typeahead input', async () => {
    render(<Default autoFocus />);

    await waitFor(() => {
      expect(getInput()).toHaveFocus();
    });
  });

  it('sets and unsets the focus state on focus/blur', async () => {
    render(<Default />);
    const input = getInput();

    expect(input).not.toHaveFocus();

    input.focus();
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    input.blur();
    expect(input).not.toHaveFocus();
  });

  describe('input focus', () => {
    afterEach(() => {
      // The menu should close but the input stays focused.
      expect(getMenu()).not.toBeInTheDocument();
      expect(getInput()).toHaveFocus();
    });

    it('maintains focus when clicking a menu item', async () => {
      const user = userEvent.setup();
      render(<Default />);
      const input = getInput();

      await input.focus();
      await user.click(getItems()[0]);
    });

    it('maintains focus when clicking the clear button', async () => {
      const user = userEvent.setup();
      render(<ClearButton />);

      const input = getInput();
      input.focus();

      // Click the close button
      await user.click(screen.getByRole('button'));
    });
  });

  it('truncates selections when using `defaultSelected`', () => {
    let selected: Option[] = states.slice(0, 4);
    render(
      <Default defaultSelected={selected}>
        {(state) => {
          selected = state.selected;
        }}
      </Default>
    );

    expect(selected).toHaveLength(1);
  });

  describe('behaviors when selections are passed in', () => {
    let selected: { name: string }[];
    let selectedText: string;

    beforeEach(() => {
      selected = states.slice(0, 1);
      selectedText = selected[0].name;
    });

    afterEach(async () => {
      const input = getInput();
      input.focus();

      expect(input).toHaveValue(selectedText);

      const items = await findItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(selectedText);
    });

    it('filters menu options based on `selected` values', () => {
      render(<Default selected={selected} />);
    });

    it('filters menu options based on `defaultSelected` values', () => {
      render(<Default defaultSelected={selected} />);
    });
  });

  it('uses the `filterBy` prop as a callback to filter results', async () => {
    const user = userEvent.setup();
    const filterBy = jest.fn(
      (option, props) => option.name.indexOf(props.text) > -1
    );

    render(<Default filterBy={filterBy} />);

    const input = getInput();
    await user.type(input, 'Cali');

    const items = getItems();

    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('California');
    expect(filterBy).toHaveBeenCalled();
  });

  it('does not filter options when the menu is closed', async () => {
    const user = userEvent.setup();
    const filterBy = jest.fn();
    render(<Default filterBy={filterBy} open={false} />);

    await user.type(getInput(), 'Cali');

    expect(filterBy).not.toHaveBeenCalled();
  });

  describe('menu visibility behavior', () => {
    it('shows the menu on initial render', async () => {
      render(<Default defaultOpen />);
      expect(await findMenu()).toBeInTheDocument();
    });

    it('shows the menu when `open` is `true`', async () => {
      render(<Default open />);
      expect(await findMenu()).toBeInTheDocument();
    });

    it('hides the menu when `open` is `false`', () => {
      render(<Default open={false} />);
      getInput().focus();
      expect(getMenu()).not.toBeInTheDocument();
    });

    it('shows the menu when the input is focused', async () => {
      render(<Default />);
      getInput().focus();
      expect(await findMenu()).toBeInTheDocument();
    });

    it('hides the menu on focus when `minLength=1`', () => {
      render(<Default minLength={1} />);
      getInput().focus();
      expect(getMenu()).not.toBeInTheDocument();
    });

    it('shows the menu when there are no results and `allowNew=true`', async () => {
      const user = userEvent.setup();
      render(<AllowNew options={[]} />);

      await user.type(getInput(), 'xx');

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('New selection: xx');
    });
  });

  it('should disable the input if the component is disabled', () => {
    render(<Default disabled />);
    expect(getInput()).toBeDisabled();
  });

  it('should not highlight disabled options', async () => {
    const user = userEvent.setup();
    const options = [
      { name: 'foo' },
      { disabled: true, name: 'bar' },
      { disabled: true, name: 'boo' },
      { name: 'baz' },
      { disabled: true, name: 'bro' },
    ];

    render(<Default options={options} />);
    getInput().focus();
    const items = await findItems();

    expect(items[1]).toHaveClass('disabled');
    expect(items[2]).toHaveClass('disabled');
    expect(items[4]).toHaveClass('disabled');

    await user.keyboard('{ArrowDown}');
    expect(items[0]).toHaveClass('active');

    await user.keyboard('{ArrowDown}');
    expect(items[3]).toHaveClass('active');

    await user.keyboard('{ArrowUp}');
    expect(items[0]).toHaveClass('active');

    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(items[3]).toHaveClass('active');
  });

  describe('pagination behaviors', () => {
    let onPaginate: jest.Mock;
    let shownResultsCount: number;

    beforeEach(() => {
      shownResultsCount = 10;

      onPaginate = jest.fn((e, shownResults) => {
        shownResultsCount = shownResults;
      });
    });

    it('has a menu item for pagination', async () => {
      render(<Pagination />);

      getInput().focus();

      const paginator = await findPaginator();
      expect(paginator).toHaveTextContent('Display additional results...');
      expect(paginator).toHaveClass('rbt-menu-pagination-option');
    });

    it('handles non-string labels', async () => {
      render(<Pagination paginationText={<div>More...</div>} />);

      getInput().focus();

      const paginator = await findPaginator();
      expect(paginator).toHaveTextContent('More...');
      expect(paginator).toHaveAttribute('aria-label', '');
    });

    it('triggers the pagination item via mouse or keyboard', async () => {
      const user = userEvent.setup();
      render(<Pagination onPaginate={onPaginate} />);

      getInput().focus();
      const paginator = await findPaginator();
      await user.click(paginator);

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(20);
      expect(getItems()).toHaveLength(21);

      await user.keyboard('{ArrowUp}{Enter}');
      expect(onPaginate).toHaveBeenCalledTimes(2);
      expect(shownResultsCount).toBe(30);
      expect(getItems()).toHaveLength(31);
    });

    it('calls `onPaginate` when `labelKey` is a function', async () => {
      const user = userEvent.setup();
      render(<Pagination labelKey={(o) => o.name} onPaginate={onPaginate} />);

      getInput().focus();
      await user.keyboard('{ArrowUp}{Enter}');

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(20);
      expect(getItems()).toHaveLength(21);
    });

    it('displays custom pagination text', async () => {
      const paginationText = 'More Results...';
      render(<Pagination paginationText={paginationText} />);

      getInput().focus();
      const paginator = await findPaginator();
      expect(paginator).toHaveTextContent(paginationText);
    });

    it('does not have a menu item for pagination', async () => {
      render(<Pagination paginate={false} />);
      getInput().focus();

      const paginator = await findPaginator();
      expect(paginator).not.toHaveTextContent('Display additional results...');
      expect(paginator).not.toHaveClass('rbt-menu-pagination-option');
    });

    it('resets the shown results when the input value changes', async () => {
      const user = userEvent.setup();
      render(<Pagination maxResults={5} onPaginate={onPaginate} />);

      const input = getInput();
      await user.type(input, 'ar');
      await user.keyboard('{ArrowUp}{Enter}');

      expect(onPaginate).toHaveBeenCalledTimes(1);
      expect(shownResultsCount).toBe(10);

      await user.clear(input);
      await user.type(input, 'or');
      await user.keyboard('{ArrowUp}{Enter}');

      expect(onPaginate).toHaveBeenCalledTimes(2);
      expect(shownResultsCount).toBe(10);
    });

    it('updates the active item after pagination', async () => {
      const user = userEvent.setup();
      render(<Pagination />);

      getInput().focus();
      await user.keyboard('{ArrowUp}{Enter}');

      const items = getItems();
      expect(items).toHaveLength(21);
      expect(items[10]).toHaveClass('active');
    });
  });

  describe('when `maxResults` is set', () => {
    it('should limit results when `paginate=true`', async () => {
      render(<Pagination />);
      getInput().focus();

      // When `paginate` is true, there will be a pagination menu item in
      // addition to the shown results.
      const items = await findItems();
      expect(items).toHaveLength(11);
    });

    it('should limit results when `paginate=false`', async () => {
      render(<Pagination paginate={false} />);
      getInput().focus();

      const items = await findItems();
      expect(items).toHaveLength(10);
    });
  });

  it('renders a large input', () => {
    render(<Default size="lg" />);
    expect(getInput()).toHaveClass('form-control-lg');
  });

  it('renders a small input', () => {
    render(<Default size="sm" />);
    expect(getInput()).toHaveClass('form-control-sm');
  });

  it('does not render a loading indicator by default', () => {
    render(<Default />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a loading indicator', () => {
    render(<Default isLoading />);
    expect(screen.queryByRole('status')).toBeInTheDocument();
  });

  describe('updates when re-rendering with new props', () => {
    it('acts as a controlled input in single-select mode', () => {
      let selected: Option[] = [];

      const children = (state) => {
        selected = state.selected;
      };
      const selected1 = states.slice(0, 1);
      const selected2 = states.slice(1, 2);

      // Pass in new selection
      const { rerender } = render(
        <Default selected={selected1}>{children}</Default>
      );

      expect(selected).toEqual(selected1);
      expect(getInput()).toHaveValue(selected1[0].name);

      // Pass in another new selection
      rerender(<Default selected={selected2}>{children}</Default>);

      expect(selected).toEqual(selected2);
      expect(getInput()).toHaveValue(selected2[0].name);

      // Clear the selections.
      rerender(<Default selected={[]}>{children}</Default>);

      expect(selected).toEqual([]);
      expect(getInput()).toHaveValue('');
    });

    it('acts as a controlled input in multi-select mode', () => {
      const { container, rerender } = render(
        <MultiSelect selected={states.slice(0, 4)} />
      );

      const tokens = getTokens(container);
      const input = getInput();

      expect(tokens).toHaveLength(4);
      expect(input).toHaveValue('');

      // Clear the selections.
      rerender(<MultiSelect selected={[]} />);

      expect(tokens).toHaveLength(0);
      expect(input).toHaveValue('');
    });

    it('updates the selections and input value in single-select mode', async () => {
      let selected: Option[] = [];
      const user = userEvent.setup();

      render(
        <Controlled selected={states.slice(0, 1)}>
          {(state) => {
            selected = state.selected;
          }}
        </Controlled>
      );

      const input = getInput();
      expect(selected).toHaveLength(1);
      expect(input).toHaveValue('Alabama');

      // Delete the last character.
      input.focus();
      await user.keyboard('{Backspace}');

      // Text entry should clear the selection and keep the partial entry.
      expect(selected).toHaveLength(0);
      expect(input).toHaveValue('Alabam');
    });
  });

  describe('`highlightOnlyResult` behavior', () => {
    let onChange: jest.Mock;
    let selected: Option[];

    beforeEach(() => {
      onChange = jest.fn((s) => (selected = [s]));
      selected = [];
    });

    it('does not highlight the only result', async () => {
      const user = userEvent.setup();
      render(<Default onChange={onChange} />);

      const input = getInput();
      await user.type(input, 'Alab');

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass('active');

      await user.keyboard('{Enter}');
      expect(selected).toHaveLength(0);
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('highlights the only result', async () => {
      const user = userEvent.setup();
      render(<Default highlightOnlyResult onChange={onChange} />);

      const input = getInput();
      await user.type(input, 'Alab');

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveClass('active');

      await user.keyboard('{Enter}');
      expect(selected).toHaveLength(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('does not highlight the only result when `allowNew=true`', async () => {
      const user = userEvent.setup();
      render(<AllowNew highlightOnlyResult onChange={onChange} />);

      const input = getInput();
      await user.type(input, 'qqq');

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass('active');

      await user.keyboard('{Enter}');
      expect(selected).toHaveLength(0);
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('does not highlight or select a disabled result', async () => {
      const user = userEvent.setup();
      render(
        <Default
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

      const input = getInput();
      await user.type(input, 'bar');

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass('active');

      await user.keyboard('{Enter}');
      expect(selected).toHaveLength(0);
      expect(onChange).toHaveBeenCalledTimes(0);
    });
  });

  it('displays the active item value in the input', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const input = getInput();
    input.focus();
    await user.keyboard('{ArrowDown}');

    expect(input).toHaveValue('Alabama');
  });

  it('applies custom styles to the top-level container', () => {
    const { container } = render(
      <Default style={{ display: 'inline-flex' }} />
    );

    expect(container.firstChild).toHaveStyle('display: inline-flex');
  });

  describe('input props', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      inputProps.onClick = jest.fn();
    });

    afterEach(async () => {
      const user = userEvent.setup();
      await user.click(input);

      expect(inputProps.onClick).toHaveBeenCalledTimes(1);
      expect(input).toHaveAttribute('autocomplete', inputProps.autoComplete);
      expect(input).toHaveClass(inputProps.className);
      expect(input).toHaveAttribute('id', inputProps.id);
      expect(input).toHaveAttribute('name', inputProps.name);
      expect(input).toHaveAttribute('tabIndex', `${inputProps.tabIndex}`);
      expect(input).toHaveAttribute('type', inputProps.type);
    });

    it('applies the input props single-select mode', () => {
      render(<Default inputProps={inputProps} />);
      input = getInput();
    });

    it('applies the input props in multi-select mode', () => {
      render(
        <MultiSelect inputProps={inputProps} selected={states.slice(0, 1)} />
      );

      input = getInput();

      const token = screen.getByRole('button').parentElement;
      expect(token).toHaveAttribute('tabIndex', `${inputProps.tabIndex}`);
    });
  });

  it('calls `onBlur`', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();

    render(<Default onBlur={onBlur} />);

    const input = getInput();
    await user.click(input);

    input.blur();
    await waitFor(() => {
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  it('calls `onFocus`', async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();

    render(<Default onFocus={onFocus} />);
    await user.click(getInput());

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls `onKeyDown`', async () => {
    const user = userEvent.setup();
    const onKeyDown = jest.fn();

    render(<Default onKeyDown={onKeyDown} />);
    await user.click(getInput());
    await user.keyboard('{Enter}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('calls `onMenuToggle`', async () => {
    const user = userEvent.setup();
    const onMenuToggle = jest.fn();

    render(<Default onMenuToggle={onMenuToggle} />);
    const input = getInput();

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

    await user.keyboard('{Escape}');
    expect(onMenuToggle).toHaveBeenCalledTimes(2);
  });

  describe('hint behavior', () => {
    it('hides and shows the hint in the single-select case', async () => {
      const user = userEvent.setup();
      const { container } = render(<Default />);

      const input = getInput();
      const hint = getHint(container);

      await user.type(input, 'Ala');
      expect(input).toHaveFocus();
      expect(hint).toHaveValue('Alabama');

      input.blur();
      await waitFor(() => {
        expect(input).not.toHaveFocus();
      });
      expect(hint).toHaveValue('');
    });

    it('hides and shows the hint in the multi-select case', async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelect selected={[]} />);

      const input = getInput();
      const hint = getHint(container);

      await user.type(input, 'Ala');
      expect(input).toHaveFocus();
      expect(hint).toHaveValue('Alabama');

      input.blur();
      await waitFor(() => {
        expect(input).not.toHaveFocus();
      });
      expect(hint).toHaveValue('');
    });

    it('does not display a hint if the menu is hidden', async () => {
      const user = userEvent.setup();
      const { container } = render(<Default />);
      const input = getInput();
      const hint = getHint(container);

      await user.type(input, 'Ala');

      // When focused, the typeahead should show the menu and hint text.
      expect(getMenu()).toBeInTheDocument();
      expect(hint).toHaveValue('Alabama');

      await user.keyboard('{Escape}');

      // Expect the input to remain focused, but the menu and hint to be hidden.
      expect(input).toHaveFocus();
      expect(getMenu()).not.toBeInTheDocument();
      expect(hint).toHaveValue('');
    });

    it('only displays a hint for non-disabled items', async () => {
      const user = userEvent.setup();
      const { container } = render(<DisabledItem />);
      const input = getInput();
      const hint = getHint(container);

      await user.type(input, 'Ala');

      // The hint should not display if the initial item is disabled.
      expect(hint).toHaveValue('');

      await user.clear(input);
      await user.type(input, 'Ari');
      expect(hint).toHaveValue('Arizona');
    });
  });

  describe('behavior when selecting the hinted result', () => {
    let key: number;
    let onChange: jest.Mock;
    let onKeyDown: jest.Mock;

    beforeEach(() => {
      key = 0;
      onChange = jest.fn();
      onKeyDown = jest.fn((e) => (key = e.key));
    });

    it('should select the hinted result on tab keydown', async () => {
      const user = userEvent.setup();
      render(<Default onChange={onChange} onKeyDown={onKeyDown} />);

      await user.type(getInput(), 'Ala');
      await user.tab();

      expect(key).toBe('Tab');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should select the hinted result on right arrow keydown', async () => {
      const user = userEvent.setup();
      render(<Default onChange={onChange} onKeyDown={onKeyDown} />);

      const input = getInput();
      await user.type(input, 'Ala');
      await user.keyboard('{arrowright}');

      expect(key).toBe('ArrowRight');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it(
      'should not select the hinted result on right arrow keydown unless ' +
        'the cursor is at the end of the input value',
      async () => {
        const user = userEvent.setup();
        render(<Default onChange={onChange} onKeyDown={onKeyDown} />);

        const input = getInput();
        await user.type(input, 'Ala');

        input.selectionStart = 1;
        await user.keyboard('{arrowright}');

        expect(key).toBe('ArrowRight');
        expect(onChange).toHaveBeenCalledTimes(0);
      }
    );

    it('should not select the hinted result on enter keydown', async () => {
      const user = userEvent.setup();
      render(<Default onChange={onChange} onKeyDown={onKeyDown} />);

      await user.type(getInput(), 'Ala');
      await user.keyboard('{Enter}');
      expect(key).toBe('Enter');
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('should select the hinted result on enter keydown', async () => {
      const user = userEvent.setup();
      render(
        <Default
          onChange={onChange}
          onKeyDown={onKeyDown}
          selectHint={(shouldSelectHint, e) =>
            e.key === 'Enter' || shouldSelectHint
          }
        />
      );

      const input = getInput();
      await user.type(input, 'Ala');
      await user.keyboard('{Enter}');

      expect(key).toBe('Enter');
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('keydown behaviors with active item', () => {
    let onChange: jest.Mock;
    let onKeyDown: jest.Mock;

    beforeEach(() => {
      onChange = jest.fn();
      onKeyDown = jest.fn();
    });

    it('selects the active item when pressing return', async () => {
      const user = userEvent.setup();
      render(<Default onChange={onChange} onKeyDown={onKeyDown} />);

      getInput().focus();
      await user.keyboard('{ArrowDown}{Enter}');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });

    it('does not select the active item when the menu is closed', async () => {
      const user = userEvent.setup();
      render(
        <Default onChange={onChange} onKeyDown={onKeyDown} open={false} />
      );

      getInput().focus();
      await user.keyboard('{ArrowDown}{Enter}');

      expect(onChange).toHaveBeenCalledTimes(0);
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });
  });

  it('prevents form submission when the menu is open', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <form onSubmit={onSubmit}>
        <Default />
        <button type="submit">submit</button>
      </form>
    );

    const input = getInput();
    input.focus();

    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(0);

    await user.keyboard('{Escape}{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('hides the menu when tabbing out of the input', async () => {
    const user = userEvent.setup();
    render(<Default />);

    getInput().focus();
    await waitFor(() => {
      expect(getMenu()).toBeInTheDocument();
    });

    await user.tab();
    expect(getMenu()).not.toBeInTheDocument();
  });

  it('calls the keydown handler when a key is pressed', async () => {
    const user = userEvent.setup();
    const onKeyDown = jest.fn();
    render(<Default onKeyDown={onKeyDown} />);

    await user.type(getInput(), 'foo');

    expect(onKeyDown).toHaveBeenCalledTimes(3);
  });

  describe('accessibility attributes', () => {
    it('adds an id to the menu for accessibility', async () => {
      const { rerender } = render(<Default />);
      const input = getInput();

      expect(input).not.toHaveAttribute('aria-owns');

      input.focus();
      const menu = await findMenu();

      expect(menu).toHaveAttribute('id', ID);
      expect(input).toHaveAttribute('aria-owns', ID);

      const id = 'my-id';
      rerender(<Default id={id} />);

      expect(menu).toHaveAttribute('id', id);
      expect(input).toHaveAttribute('aria-owns', id);
    });

    it('sets aria attributes for single-selection', async () => {
      const user = userEvent.setup();
      render(<Default id="my-id" />);
      const input = getInput();

      expect(input).toHaveAttribute('aria-autocomplete', 'both');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).not.toHaveAttribute('aria-activedescendant');

      input.focus();
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-activedescendant', 'my-id-item-0');
    });

    it('sets aria attributes for multi-selection', () => {
      render(<MultiSelect />);
      const input = getInput();

      expect(input).toHaveAttribute('aria-autocomplete', 'both');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('sets menu item attributes', async () => {
      const user = userEvent.setup();
      render(<Default id="my-id" />);

      getInput().focus();
      const items = await findItems();
      const item = items[0];

      expect(item).toHaveAttribute('aria-label', 'Alabama');
      expect(item).toHaveAttribute('aria-selected', 'false');
      expect(item).toHaveClass('dropdown-item');

      await user.keyboard('{ArrowDown}');
      expect(item).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('<Typeahead> multi-select', () => {
    it('displays and removes selections', async () => {
      const user = userEvent.setup();
      render(<MultiSelect />);

      // Use close button as a proxy for the token.
      const closeButtons = screen.getAllByRole('button');
      expect(closeButtons).toHaveLength(4);

      await user.click(closeButtons[0]);
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('adds selections', async () => {
      const user = userEvent.setup();
      render(<MultiSelect />);

      const input = getInput();
      input.focus();
      await user.keyboard('{ArrowDown}{Enter}');

      expect(screen.getAllByRole('button')).toHaveLength(5);
      expect(input).toHaveValue('');
    });
  });

  it('opens the menu when the up or down arrow keys are pressed', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const input = getInput();
    input.focus();

    expect(await findMenu()).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(getMenu()).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    expect(getMenu()).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(getMenu()).not.toBeInTheDocument();

    await user.keyboard('{ArrowUp}');
    expect(getMenu()).toBeInTheDocument();
  });

  it('renders a custom input', () => {
    const renderInput = jest.fn();
    render(<Default renderInput={renderInput} />);
    expect(renderInput).toHaveBeenCalled();
  });

  it('renders custom content in the menu items', async () => {
    render(
      <Default
        renderMenuItemChildren={
          // Render the capital instead of the state name.
          (o) => o.capital
        }
      />
    );

    getInput().focus();

    const items = await findItems();
    expect(items[0]).toHaveTextContent('Montgomery');
  });

  it('renders custom tokens', () => {
    render(
      <Default
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
      <Default>
        <div data-testid="children">{text}</div>
      </Default>
    );

    const children = screen.queryByTestId('children');
    expect(children).toBeInTheDocument();
    expect(children).toHaveTextContent(text);
  });

  it('renders children via a render function', async () => {
    render(
      <Default>
        {(props) => (
          <div data-testid="children">
            The menu {props.isMenuShown ? 'is' : 'is not'} open
          </div>
        )}
      </Default>
    );

    const children = screen.getByTestId('children');
    expect(children).toHaveTextContent('The menu is not open');

    getInput().focus();
    await waitFor(() => {
      expect(children).toHaveTextContent('The menu is open');
    });
  });

  describe('validation states', () => {
    it('renders with validation classnames in single-select mode', () => {
      const { rerender } = render(<Default />);

      const input = getInput();
      expect(input).not.toHaveClass('is-invalid');
      expect(input).not.toHaveClass('is-valid');

      rerender(<Default isInvalid isValid />);
      expect(input).toHaveClass('is-invalid');
      expect(input).toHaveClass('is-valid');
    });

    it('renders with validation classnames in multi-select mode', () => {
      const { container, rerender } = render(<MultiSelect />);

      const formControl = container.getElementsByClassName('form-control')[0];
      expect(formControl).not.toHaveClass('is-invalid');
      expect(formControl).not.toHaveClass('is-valid');

      rerender(<MultiSelect isInvalid isValid />);
      expect(formControl).toHaveClass('is-invalid');
      expect(formControl).toHaveClass('is-valid');
    });

    it('displays validation feedback', () => {
      const validFeedback = /Looks good/;
      const invalidFeedback = /Please provide a value/;

      const { rerender } = render(
        <InputValidation isInvalid={false} isValid={false} />
      );
      expect(screen.queryByText(validFeedback)).not.toBeInTheDocument();
      expect(screen.queryByText(invalidFeedback)).not.toBeInTheDocument();

      rerender(<InputValidation isInvalid={false} isValid />);
      expect(screen.getByText(validFeedback)).toBeInTheDocument();

      rerender(<InputValidation isInvalid={false} isValid multiple />);
      expect(screen.getByText(validFeedback)).toBeInTheDocument();

      rerender(<InputValidation isInvalid isValid={false} />);
      expect(screen.getByText(invalidFeedback)).toBeInTheDocument();

      rerender(<InputValidation isInvalid isValid={false} multiple />);
      expect(screen.getByText(invalidFeedback)).toBeInTheDocument();
    });
  });

  describe('allowNew behavior', () => {
    let emptyLabel: string;
    let newSelectionPrefix: ReactNode;
    let value: string;

    beforeEach(() => {
      emptyLabel = 'No results...';
      newSelectionPrefix = 'New selection: ';
      value = 'xxx';
    });

    it('omits the custom option when `allowNew` is set to `false`', async () => {
      const user = userEvent.setup();
      render(<Default emptyLabel={emptyLabel} />);

      const input = getInput();
      await user.type(input, value);

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(emptyLabel);
    });

    it('adds the custom option when `allowNew` is set to `true`', async () => {
      let selected: Option[] = [];
      const user = userEvent.setup();

      render(
        <AllowNew
          emptyLabel={emptyLabel}
          newSelectionPrefix={newSelectionPrefix}
          onChange={(s) => {
            selected = s;
          }}
        />
      );

      const input = getInput();
      await user.type(input, value);

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(`${newSelectionPrefix}${value}`);

      await user.click(items[0]);
      expect(selected[0].id).toContain('new-id-');
    });

    it('omits the custom option when there is an exact text match', async () => {
      const user = userEvent.setup();
      value = 'North Carolina';
      render(<AllowNew />);

      const input = getInput();
      await user.type(input, value);

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(value);
    });

    it('adds a custom option when `allowNew` returns true', async () => {
      const user = userEvent.setup();
      value = 'North Carolina';

      render(
        <AllowNew
          allowNew={() => true}
          newSelectionPrefix={newSelectionPrefix}
        />
      );

      const input = getInput();
      await user.type(input, value);

      const items = getItems();
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent(value);
      expect(items[1]).toHaveTextContent(`${newSelectionPrefix}${value}`);
    });

    it('omits new option when `allowNew` returns false', async () => {
      const user = userEvent.setup();
      render(<AllowNew allowNew={() => false} emptyLabel={emptyLabel} />);

      const input = getInput();
      await user.type(input, value);

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(emptyLabel);
    });

    it('handles custom options when `labelKey` is a function', async () => {
      const user = userEvent.setup();
      render(
        <AllowNew
          labelKey={(o) => o.name}
          newSelectionPrefix={newSelectionPrefix}
        />
      );

      const input = getInput();
      await user.type(input, value);

      const items = getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(`${newSelectionPrefix}${value}`);
    });
  });
});

describe('<Typeahead> Public Methods', () => {
  it('exposes the typeahead instance and public methods', () => {
    const ref = createRef<Typeahead>();
    render(<TestComponent ref={ref} />);

    expect(typeof ref.current?.blur).toBe('function');
    expect(typeof ref.current?.clear).toBe('function');
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.getInput).toBe('function');
    expect(typeof ref.current?.hideMenu).toBe('function');
    expect(typeof ref.current?.toggleMenu).toBe('function');
  });

  it('calls the public `focus` and `blur` methods', async () => {
    const ref = createRef<Typeahead>();
    render(<TestComponent ref={ref} />);

    const input = getInput();

    ref.current?.focus();
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    ref.current?.blur();
    expect(input).not.toHaveFocus();
  });

  it('calls the public `clear` method', async () => {
    const user = userEvent.setup();
    const ref = createRef<Typeahead>();
    const { container } = render(
      <TestComponent multiple ref={ref} defaultSelected={states.slice(0, 3)} />
    );

    const input = getInput();
    await user.type(input, 'foo');
    const tokens = container.getElementsByClassName('rbt-token');

    expect(tokens).toHaveLength(3);
    expect(input).toHaveValue('foo');

    ref.current?.clear();

    await waitFor(() => {
      expect(tokens).toHaveLength(0);
    });
    expect(input).toHaveValue('');
  });

  it('calls the public `getInput` method', () => {
    const ref = createRef<Typeahead>();
    render(<TestComponent ref={ref} />);
    expect(ref.current?.getInput()).toEqual(getInput());
  });

  it('calls the public `hideMenu` method', async () => {
    const ref = createRef<Typeahead>();
    render(<TestComponent ref={ref} />);

    getInput()?.focus();
    const menu = await findMenu();
    expect(menu).toBeInTheDocument();

    ref.current?.hideMenu();
    await waitFor(() => {
      expect(menu).not.toBeInTheDocument();
    });
  });

  it('calls the public `toggleMenu` method', async () => {
    const ref = createRef<Typeahead>();
    render(<TestComponent ref={ref} />);

    expect(getMenu()).not.toBeInTheDocument();

    ref.current?.toggleMenu();
    await waitFor(() => {
      expect(getMenu()).toBeInTheDocument();
    });

    ref.current?.toggleMenu();
    await waitFor(() => {
      expect(getMenu()).not.toBeInTheDocument();
    });
  });

  it('clears the typeahead after a selection', async () => {
    const user = userEvent.setup();
    const ref = createRef<Typeahead>();
    const onChange = jest.fn(() => {
      ref.current?.clear();
    });
    render(<TestComponent onChange={onChange} ref={ref} />);

    const input = getInput();
    input.focus();

    const items = await findItems();
    await user.click(items[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
  });
});

describe('<Typeahead> `change` events', () => {
  let onChange: jest.Mock;
  let onInputChange: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
    onInputChange = jest.fn();
  });

  it('calls `onChange` when a menu item is clicked', async () => {
    const user = userEvent.setup();
    render(<Default onInputChange={onInputChange} onChange={onChange} />);

    getInput().focus();
    const items = await findItems();
    await user.click(items[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('calls `onChange` when a menu item is selected via keyboard', async () => {
    const user = userEvent.setup();
    render(<Default onInputChange={onInputChange} onChange={onChange} />);

    getInput().focus();
    await user.keyboard('{arrowdown}{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('handles clear button clicks in single-select mode', async () => {
    const user = userEvent.setup();
    let event, value;

    onInputChange = jest.fn((e) => {
      value = e.target.value;
      event = e;
    });

    render(<ClearButton onChange={onChange} onInputChange={onInputChange} />);

    await user.click(screen.getByRole('button'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(value).toBe('');
    expect(event).toBeDefined();
  });

  it('handles clear button clicks in multi-select mode', async () => {
    let selected;
    const user = userEvent.setup();

    onInputChange = jest.fn();
    onChange = jest.fn((s) => {
      selected = s;
    });

    render(
      <ClearButton multiple onChange={onChange} onInputChange={onInputChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(0);
    expect(selected).toHaveLength(0);
  });

  it('handles clear button clicks in multi-select mode with initial input', async () => {
    let event, selected, value;
    const user = userEvent.setup();

    onInputChange = jest.fn((e) => {
      value = e.target.value;
      event = e;
    });

    onChange = jest.fn((s) => {
      selected = s;
    });

    // Test that any text in the input also gets cleared.
    render(
      <ClearButton
        defaultInputValue="test"
        multiple
        onChange={onChange}
        onInputChange={onInputChange}
        selected={states.slice(0, 2)}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(value).toBe('');
    expect(event).toBeDefined();
    expect(selected).toHaveLength(0);
  });

  it('calls `onInputChange` when text is entered in the input', async () => {
    const user = userEvent.setup();
    render(<Default onInputChange={onInputChange} />);

    const input = getInput();
    await user.type(input, 'z');

    expect(onInputChange).toHaveBeenCalledTimes(1);
  });

  it('`onInputChange` receives an event as the argument', async () => {
    let event;
    const user = userEvent.setup();
    render(<Default onInputChange={(e) => (event = e)} />);

    const input = getInput();
    await user.type(input, 'z');

    expect(event).toBeDefined();
  });

  it('calls `onChange` when there is a selection and text is entered', async () => {
    const user = userEvent.setup();
    const selected = states.slice(0, 1);
    render(
      <Default
        onChange={onChange}
        onInputChange={onInputChange}
        selected={selected}
      />
    );

    const input = getInput();
    await user.type(input, 'z');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledTimes(1);
  });

  it('does not call either when selections are updated via props', () => {
    const selected = states.slice(0, 1);
    const { rerender } = render(
      <Default
        onChange={onChange}
        onInputChange={onInputChange}
        selected={[]}
      />
    );

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);

    rerender(
      <Default
        onChange={onChange}
        onInputChange={onInputChange}
        selected={selected}
      />
    );

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });

  it('does not call either when `clear()` is called externally', async () => {
    const ref = createRef<Typeahead>();
    const selected = states.slice(0, 1);
    render(
      <TestComponent
        defaultSelected={selected}
        ref={ref}
        onChange={onChange}
        onInputChange={onInputChange}
      />
    );

    expect(getInput()).toHaveValue(selected[0].name);

    ref.current?.clear();

    await waitFor(() => {
      expect(getInput()).toHaveValue('');
    });
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(onInputChange).toHaveBeenCalledTimes(0);
  });
});

describe('<Typeahead> input value behaviors', () => {
  let defaultInputValue: string;
  let defaultSelected: Option[];
  let selected: Option[];

  beforeEach(() => {
    defaultInputValue = 'This is a default value';
    defaultSelected = states.slice(0, 1);
    selected = states.slice(0, 1);
  });

  it("doesn't set a value when there is no default value or selection", () => {
    render(<Default selected={[]} />);
    expect(getInput()).toHaveValue('');
  });

  it('sets an input value based on the `selected` value', () => {
    render(<Default selected={selected} />);
    expect(getInput()).toHaveValue(selected[0].name);
  });

  it('sets a default initial input value', () => {
    render(<Default defaultInputValue={defaultInputValue} />);
    expect(getInput()).toHaveValue(defaultInputValue);
  });

  it('sets an input value based on the `defaultSelected` value', () => {
    render(<Default defaultSelected={defaultSelected} />);
    expect(getInput()).toHaveValue(defaultSelected[0].name);
  });

  it('overrides the default input value if there is a selection', () => {
    render(
      <Default defaultInputValue={defaultInputValue} selected={selected} />
    );
    expect(getInput()).toHaveValue(selected[0].name);
  });
});

describe('<Typeahead> with clear button', () => {
  it('does not display a clear button', () => {
    render(<ClearButton selected={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('displays a clear button', () => {
    render(<ClearButton />);
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });
});

/**
 * Some basic tests for the custom menu-rendering use-case.
 * Helps ensure that the context-related logic doesn't break.
 */
describe('<Typeahead> with custom menu', () => {
  it('renders the custom menu', async () => {
    render(<CustomMenu />);
    getInput().focus();

    const items = await findItems();
    expect(items[0]).toHaveTextContent('Wyoming');
  });

  it('shows the correct hint', async () => {
    const user = userEvent.setup();
    const { container } = render(<CustomMenu />);
    const hint = getHint(container);

    await user.type(getInput(), 'u');

    const items = getItems();
    expect(items[0]).toHaveTextContent('Utah');
    expect(hint).toHaveValue('utah');
  });

  it('selects the correct option', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<CustomMenu onChange={onChange} />);

    const input = getInput();
    input.focus();
    await user.keyboard('{ArrowDown}');

    const items = getItems();
    expect(items[0]).toHaveTextContent('Wyoming');
    expect(items[0]).toHaveClass('active');

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('Wyoming');
  });

  // Integration test to ensure that active index updating works correctly when
  // reshuffling the result set.
  it('correctly handles disabled options', async () => {
    const user = userEvent.setup();
    const options = states.map((state) => {
      return state.name === 'Wyoming' ? { ...state, disabled: true } : state;
    });

    render(<CustomMenu options={options} />);

    getInput().focus();
    await user.keyboard('{ArrowDown}');

    // Keying down should skip over the first option
    const items = getItems();
    expect(items[1]).toHaveClass('active');
    expect(items[1]).toHaveTextContent('Wisconsin');
  });
});
