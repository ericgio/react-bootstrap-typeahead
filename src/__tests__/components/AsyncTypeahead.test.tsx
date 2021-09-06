import React, { createRef, useState } from 'react';

import { AsyncTypeahead } from '../..';
import {
  act,
  getInput,
  getItems,
  noop,
  render,
  screen,
  userEvent,
  waitFor,
} from '../helpers';

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
  it('displays a search prompt', () => {
    const promptText = 'Prompt text';
    render(<TestComponent promptText={promptText} />);
    getInput(screen).focus();

    const items = getItems(screen);
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(promptText);
  });

  it('displays the search text while searching', (done) => {
    const searchText = 'Search text';

    render(
      <TestComponent
        onSearch={() => {
          const items = getItems(screen);
          expect(items).toHaveLength(1);
          expect(items[0]).toHaveTextContent(searchText);
          done();
        }}
        searchText={searchText}
      />
    );

    userEvent.type(getInput(screen), 'search');
  });

  it('displays the empty label when there are no results', async () => {
    const emptyLabel = 'empty label';
    render(<TestComponent emptyLabel={emptyLabel} />);

    const input = getInput(screen);
    userEvent.type(input, 'foo');

    await waitFor(() => {
      const items = getItems(screen);
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent(emptyLabel);
    });
  });

  it('displays the empty label when the input has an initial value', () => {
    const emptyLabel = 'empty label';

    render(
      <AsyncTypeahead
        defaultInputValue="sometext"
        delay={0}
        emptyLabel={emptyLabel}
        id="async-empty-label-test"
        isLoading={false}
        minLength={0}
        onSearch={noop}
        useCache={false}
      />
    );

    getInput(screen).focus();

    const items = getItems(screen);
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent(emptyLabel);
  });

  it('delays the search by at least the specified amount', async () => {
    const delay = 100;
    const preSearch = Date.now();

    render(<TestComponent delay={delay} />);

    userEvent.type(getInput(screen), 'search');
    await waitFor(() => {
      expect(Date.now() - preSearch).toBeGreaterThanOrEqual(delay);
    });
  });

  it('does not call onSearch when a selection is made', () => {
    const onChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <TestComponent
        onChange={onChange}
        onSearch={onSearch}
        options={['one', 'two', 'four']}
      />
    );

    getInput(screen).focus();
    userEvent.keyboard('{arrowdown}{enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  it('uses cached results and does not perform a new search', async () => {
    const onSearch = jest.fn();
    render(<TestComponent onSearch={onSearch} useCache />);

    const input = getInput(screen);
    userEvent.type(input, 'foo');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    userEvent.clear(input);
    userEvent.type(input, 'bar');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(2);
    });

    userEvent.clear(input);
    userEvent.type(input, 'foo');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(2);
    });
  });

  it('does not use cached results', async () => {
    const onSearch = jest.fn();
    render(<TestComponent onSearch={onSearch} useCache={false} />);

    const input = getInput(screen);
    userEvent.type(input, 'search');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    userEvent.clear(input);
    userEvent.type(input, 'search');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(2);
    });
  });

  it('does not call `onSearch` with an empty query', async () => {
    const onInputChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <TestComponent
        defaultInputValue="x"
        onInputChange={onInputChange}
        onSearch={onSearch}
      />
    );

    getInput(screen).focus();
    userEvent.keyboard('{backspace}');

    await waitFor(() => {
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledTimes(0);
    });
  });

  it('does not call `onSearch` if query is less than `minLength`', async () => {
    const onInputChange = jest.fn();
    const onSearch = jest.fn();

    render(
      <TestComponent
        minLength={2}
        onInputChange={onInputChange}
        onSearch={onSearch}
      />
    );

    userEvent.type(getInput(screen), 'x');

    await waitFor(() => {
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledTimes(0);
    });
  });

  it('performs a search when there is already a selection', async () => {
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

    userEvent.type(getInput(screen), 'foo');
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('receives an event as the second argument of `onInputChange`', () => {
    render(
      <TestComponent
        onInputChange={(text, e) => {
          expect(text).toBe('x');
          expect(e).toBeDefined();
        }}
      />
    );

    userEvent.type(getInput(screen), 'x');
  });

  it('displays a custom option when `allowNew` function returns true', (done) => {
    render(
      <TestComponent
        allowNew={() => true}
        onSearch={() => {
          const items = getItems(screen);
          expect(items).toHaveLength(1);
          expect(items[0]).toHaveTextContent('zzz');
          done();
        }}
      />
    );

    userEvent.type(getInput(screen), 'zzz');
  });

  it('disables `allowNew` while results are loading', async () => {
    render(
      <TestComponent
        allowNew
        onSearch={() => {
          const items = getItems(screen);
          expect(items).toHaveLength(1);
          expect(items[0]).toHaveTextContent('Searching...');
        }}
      />
    );

    userEvent.type(getInput(screen), 'zzz');

    await waitFor(() => {
      expect(getItems(screen)[0]).toHaveTextContent('zzz');
    });
  });

  it('exposes the typeahead instance and public methods', () => {
    const ref = createRef();
    render(
      <AsyncTypeahead
        id="async-instance-test"
        isLoading={false}
        onSearch={noop}
        ref={ref}
      />
    );

    ['clear', 'blur', 'focus', 'getInput'].forEach((method) => {
      expect(typeof ref.current[method]).toBe('function');
    });
  });
});
