import { mount } from 'enzyme';
import { noop } from 'lodash';
import React, { createRef } from 'react';

import { AsyncTypeahead } from '../..';
import { change, focus, getMenuItems, simulateKeyDown } from '../helpers';
import { DOWN, RETURN } from '../../constants';

function search(wrapper, query, callback) {
  // `setProps` needs to come before `change` or several tests fail...
  wrapper.setProps({ isLoading: true });
  change(wrapper, query);

  setTimeout(() => {
    wrapper.setProps({
      isLoading: false,
      options: [],
    });
    callback();
  }, 0);
}

describe('<AsyncTypeahead>', () => {
  let onSearch, wrapper;

  beforeEach(() => {
    onSearch = jest.fn();
    wrapper = mount(
      <AsyncTypeahead
        delay={0}
        id="async-test"
        isLoading={false}
        minLength={0}
        onChange={noop}
        onSearch={onSearch}
        selected={[]}
      />
    );
  });

  test('displays a prompt', () => {
    const promptText = 'Prompt text';

    wrapper.setProps({ promptText });

    focus(wrapper);
    const menuItems = getMenuItems(wrapper);

    expect(menuItems.length).toBe(1);
    expect(menuItems.text()).toBe(promptText);
  });

  test('displays the search text while searching', (done) => {
    const searchText = 'Search text';

    onSearch = () => {
      wrapper.setProps({ isLoading: true });

      const menuItems = getMenuItems(wrapper);
      expect(menuItems.length).toBe(1);
      expect(menuItems.text()).toBe(searchText);
      done();
    };

    wrapper.setProps({
      onSearch,
      searchText,
    });

    change(wrapper, 'search');
  });

  test('displays the empty label when there are no results', (done) => {
    const emptyLabel = 'empty label';

    wrapper.setProps({ emptyLabel });

    search(wrapper, 'foo', () => {
      const menuItems = getMenuItems(wrapper);
      expect(menuItems.length).toBe(1);
      expect(menuItems.text()).toBe(emptyLabel);
      done();
    });
  });

  test('displays the empty label when the input has an initial value', () => {
    const emptyLabel = 'empty label';

    wrapper = mount(
      <AsyncTypeahead
        defaultInputValue="sometext"
        delay={0}
        emptyLabel={emptyLabel}
        id="async-empty-label-test"
        isLoading={false}
        minLength={0}
        onSearch={onSearch}
        useCache={false}
      />
    );

    focus(wrapper);
    const menuItems = getMenuItems(wrapper);

    expect(menuItems.length).toEqual(1);
    expect(menuItems.text()).toEqual(emptyLabel);
  });

  test('delays the search by at least the specified amount', (done) => {
    const delay = 100;
    const preSearch = Date.now();

    onSearch = () => {
      expect(Date.now() - preSearch).toBeGreaterThanOrEqual(delay);
      done();
    };

    // Re-mount since delay is applied in `componentDidMount`.
    wrapper = mount(
      <AsyncTypeahead
        delay={delay}
        id="async-delay-test"
        isLoading={false}
        onSearch={onSearch}
      />
    );

    // Perform search.
    change(wrapper, 'search');
  });

  test('does not call onSearch when a selection is made', () => {
    const onChange = jest.fn();

    wrapper.setProps({
      onChange,
      options: ['one', 'two', 'four'],
    });

    focus(wrapper);
    simulateKeyDown(wrapper, DOWN);
    simulateKeyDown(wrapper, RETURN);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  test('uses cached results and does not perform a new search', (done) => {
    search(wrapper, 'foo', () => {
      expect(onSearch).toHaveBeenCalledTimes(1);

      search(wrapper, 'bar', () => {
        expect(onSearch).toHaveBeenCalledTimes(2);

        // `onSearch` shouldn't be called when performing first search again.
        search(wrapper, 'foo', () => {
          expect(onSearch).toHaveBeenCalledTimes(2);
          done();
        });
      });
    });
  });

  test('does not use cached results', (done) => {
    wrapper.setProps({
      useCache: false,
    });

    search(wrapper, 'search', () => {
      expect(onSearch).toHaveBeenCalledTimes(1);

      search(wrapper, 'search', () => {
        expect(onSearch).toHaveBeenCalledTimes(2);
        done();
      });
    });
  });

  test('does not call `onSearch` with an empty query', (done) => {
    const onInputChange = jest.fn();

    wrapper.setProps({
      onInputChange,
    });

    search(wrapper, '', () => {
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledTimes(0);
      done();
    });
  });

  test('does not call `onSearch` if query is less than `minLength`', (done) => {
    const onInputChange = jest.fn();

    wrapper.setProps({
      minLength: 2,
      onInputChange,
    });

    search(wrapper, 'x', () => {
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledTimes(0);
      done();
    });
  });

  test('performs a search when there is already a selection', (done) => {
    wrapper.setProps({
      multiple: true,
      options: ['one', 'two'],
      selected: ['one'],
    });

    expect(onSearch).toHaveBeenCalledTimes(0);

    search(wrapper, 'two', () => {
      expect(onSearch).toHaveBeenCalledTimes(1);
      done();
    });
  });

  test('receives an event as the second argument of `onInputChange`', () => {
    wrapper.setProps({
      onInputChange: (text, e) => {
        expect(text).toBe('x');
        expect(e).toBeDefined();
      },
    });

    change(wrapper, 'x');
  });

  test(
    'displays a custom option when `allowNew` function returns true',
    (done) => {
      wrapper.setProps({
        allowNew: (results, props) => true,
      });

      change(wrapper, 'zzz');

      setTimeout(() => {
        wrapper.setProps({ isLoading: true });

        focus(wrapper);
        const menuItems = getMenuItems(wrapper);

        expect(menuItems.length).toBe(1);
        expect(menuItems.at(0).text()).toMatch(/zzz/);
        done();
      }, 0);
    }
  );

  test('disables `allowNew` while results are loading', (done) => {
    wrapper.setProps({
      allowNew: true,
    });

    change(wrapper, 'zzz');

    setTimeout(() => {
      wrapper.setProps({ isLoading: true });

      focus(wrapper);
      const menuItems = getMenuItems(wrapper);
      expect(menuItems.length).toBe(1);
      expect(menuItems.at(0).text()).toBe('Searching...');

      wrapper.setProps({ isLoading: false });
      expect(getMenuItems(wrapper).at(0).text()).toMatch(/zzz/);
      done();
    }, 0);
  });

  test('exposes the typeahead instance and public methods', () => {
    const ref = createRef();

    wrapper = mount(
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
