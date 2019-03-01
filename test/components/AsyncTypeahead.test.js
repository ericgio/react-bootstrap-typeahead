import { mount } from 'enzyme';
import { noop } from 'lodash';
import React from 'react';

import { AsyncTypeahead } from '../../src';
import { change, focus, getMenuItems, keyDown } from '../helpers';
import { DOWN, RETURN } from '../../src/constants';

function search(wrapper, query, callback) {
  change(wrapper, query);
  wrapper.setProps({ isLoading: true });

  setTimeout(() => {
    wrapper.setProps({ isLoading: false });
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

    wrapper.setProps({
      emptyLabel,
      useCache: false,
    });

    search(wrapper, 'search', () => {
      const menuItems = getMenuItems(wrapper);
      expect(menuItems.length).toBe(1);
      expect(menuItems.text()).toBe(emptyLabel);
      done();
    });
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
    keyDown(wrapper, DOWN);
    keyDown(wrapper, RETURN);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);
  });

  test('uses cached results and does not perform a new search', (done) => {
    let menuItems;
    let callCount = 0;

    onSearch = (options, callback) => (query) => {
      callCount += 1;

      wrapper.setProps({ isLoading: true });

      setTimeout(() => {
        wrapper.setProps({
          isLoading: false,
          options,
        });
        callback();
      }, 0);
    };

    wrapper.setProps({
      onSearch: onSearch(['test-one', 'test-two', 'test-three'], () => {
        focus(wrapper);
        menuItems = getMenuItems(wrapper);
        expect(menuItems.length).toBe(3);
        expect(callCount).toBe(1);

        wrapper.setProps({
          onSearch: onSearch([], () => {
            focus(wrapper);
            menuItems = getMenuItems(wrapper);
            expect(menuItems.length).toBe(1);
            expect(menuItems.text()).toBe('No matches found.');
            expect(callCount).toBe(2);

            // Repeat first search
            change(wrapper, 'test');
            setTimeout(() => {
              focus(wrapper);
              menuItems = getMenuItems(wrapper);
              expect(menuItems.length).toBe(3);
              expect(callCount).toBe(2);
              done();
            }, 0);
          }),
        });

        // Second search
        change(wrapper, 'test!');
      }),
    });

    // First search
    change(wrapper, 'test');
  });

  test('does not use cached results', (done) => {
    wrapper.setProps({
      useCache: false,
    });

    // Initial search
    search(wrapper, 'search', () => {
      expect(onSearch).toHaveBeenCalledTimes(1);

      // Perform the search again.
      search(wrapper, 'search', () => {
        expect(onSearch).toHaveBeenCalledTimes(2);
        done();
      });
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
    'adds a custom option when exact match is found and `allowNew` ' +
    'returns true',
    (done) => {
      const emptyLabel = 'No results...';
      const newSelectionPrefix = 'New selection: ';
      const text = 'zzz';

      wrapper.setProps({
        allowNew: (results, props) => true,
        emptyLabel,
        isLoading: true,
        newSelectionPrefix,
        useCache: false,
      });

      focus(wrapper);

      search(wrapper, text, () => {
        wrapper.setProps({
          options: [text],
        });

        focus(wrapper);
        const menuItems = getMenuItems(wrapper);

        expect(menuItems.length).toBe(2);
        expect(menuItems.at(0).text()).toBe(text);
        expect(menuItems.at(1).text()).toBe(`${newSelectionPrefix}${text}`);
        done();
      });
    }
  );

  test('makes the typehead instance and public methods available', () => {
    const instance = wrapper.instance().getInstance();

    expect(typeof instance.clear).toBe('function');
    expect(typeof instance.blur).toBe('function');
    expect(typeof instance.focus).toBe('function');
    expect(typeof instance.getInput).toBe('function');
  });
});
