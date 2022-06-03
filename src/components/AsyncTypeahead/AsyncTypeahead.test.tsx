import React, { createRef, useState } from 'react';

import AsyncTypeahead from './AsyncTypeahead';
import Typeahead from '../../core/Typeahead';
import {
  act,
  findItems,
  getInput,
  getItems,
  noop,
  render,
  userEvent,
} from '../../tests/helpers';

const TestComponent = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AsyncTypeahead
      delay={0}
      id="async-test"
      minLength={0}
      onChange={noop}
      selected={[]}
      {...props}
      isLoading={isLoading}
      onSearch={(query) => {
        act(() => {
          setIsLoading(true);
        });
        props.onSearch && props.onSearch(query);
        act(() => {
          setIsLoading(false);
        });
      }}
    />
  );
};

describe('<AsyncTypeahead>', () => {
  it('displays a search prompt', async () => {
    const promptText = 'Prompt text';
    render(<TestComponent promptText={promptText} />);

    getInput().focus();

    const items = await findItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(promptText);
  });

  it('displays the search text while searching', async () => {
    const user = userEvent.setup();
    const searchText = 'Search text';

    render(
      <TestComponent
        onSearch={() => {
          const items = getItems();
          expect(items).toHaveLength(1);
          expect(items[0]).toHaveTextContent(searchText);
        }}
        searchText={searchText}
      />
    );

    await user.type(getInput(), 'search');
  });

  it('displays the empty label when there are no results', async () => {
    const user = userEvent.setup();
    const emptyLabel = 'empty label';

    render(<TestComponent emptyLabel={emptyLabel} />);

    await user.type(getInput(), 'foo');

    const items = getItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(emptyLabel);
  });

  it('displays the empty label when the input has an initial value', async () => {
    const emptyLabel = 'empty label';
    render(
      <AsyncTypeahead
        defaultInputValue="sometext"
        delay={0}
        emptyLabel={emptyLabel}
        id="async-empty-label-test"
        isLoading={false}
        onSearch={noop}
        options={[]}
        useCache={false}
      />
    );

    getInput().focus();

    const items = await findItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(emptyLabel);
  });

  it('delays the search by at least the specified amount', async () => {
    const user = userEvent.setup();
    const delay = 100;
    const preSearch = Date.now();

    render(<TestComponent delay={delay} />);

    await user.type(getInput(), 'search');
    expect(Date.now() - preSearch).toBeGreaterThanOrEqual(delay);
  });

  it('does not call onSearch when a selection is made', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <TestComponent
        onChange={onChange}
        onSearch={onSearch}
        options={['one', 'two', 'four']}
      />
    );

    getInput().focus();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  it('uses cached results and does not perform a new search', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<TestComponent onSearch={onSearch} useCache />);

    const input = getInput();
    await user.type(input, 'f');
    expect(onSearch).toHaveBeenCalledTimes(1);

    await user.clear(input);
    await user.type(input, 'b');
    expect(onSearch).toHaveBeenCalledTimes(2);

    await user.clear(input);
    await user.type(input, 'f');
    expect(onSearch).toHaveBeenCalledTimes(2);
  });

  it('does not use cached results', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<TestComponent onSearch={onSearch} useCache={false} />);

    const input = getInput();
    await user.type(input, 's');
    expect(onSearch).toHaveBeenCalledTimes(1);

    await user.clear(input);
    await user.type(input, 's');
    expect(onSearch).toHaveBeenCalledTimes(2);
  });

  it('does not call `onSearch` with an empty query', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <TestComponent
        defaultInputValue="x"
        minLength={2}
        onInputChange={onInputChange}
        onSearch={onSearch}
      />
    );

    const input = getInput();
    expect(input).toHaveValue('x');
    input.focus();

    await user.keyboard('{Backspace}');
    expect(input).toHaveValue('');
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  it('does not call `onSearch` if query is less than `minLength`', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <TestComponent
        minLength={2}
        onInputChange={onInputChange}
        onSearch={onSearch}
      />
    );

    await user.type(getInput(), 'x');
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  it('performs a search when there is already a selection', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(
      <TestComponent
        multiple
        onSearch={onSearch}
        options={['one', 'two']}
        selected={['one']}
      />
    );

    expect(onSearch).toHaveBeenCalledTimes(0);

    await user.type(getInput(), 'f');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('receives an event as the second argument of `onInputChange`', async () => {
    const user = userEvent.setup();
    render(
      <TestComponent
        minLength={2}
        onInputChange={(text, e) => {
          expect(text).toBe('x');
          expect(e).toBeDefined();
        }}
      />
    );

    await user.type(getInput(), 'x');
  });

  it('displays a custom option when `allowNew` function returns true', async () => {
    const user = userEvent.setup();
    render(<TestComponent allowNew={() => true} />);

    await user.type(getInput(), 'zzz');

    const items = getItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('zzz');
  });

  it('disables `allowNew` while results are loading', async () => {
    const user = userEvent.setup();
    render(
      <TestComponent
        allowNew
        onSearch={() => {
          const items = getItems();
          expect(items).toHaveLength(1);
          expect(items[0]).toHaveTextContent('Searching...');
        }}
      />
    );

    await user.type(getInput(), 'zzz');
    expect(getItems()[0]).toHaveTextContent('zzz');
  });

  it('exposes the typeahead instance and public methods', () => {
    const ref = createRef<Typeahead>();

    render(
      <AsyncTypeahead
        id="async-instance-test"
        isLoading={false}
        onSearch={noop}
        options={[]}
        ref={ref}
      />
    );

    ['clear', 'blur', 'focus', 'getInput'].forEach((method) => {
      expect(typeof ref.current[method]).toBe('function');
    });
  });
});
