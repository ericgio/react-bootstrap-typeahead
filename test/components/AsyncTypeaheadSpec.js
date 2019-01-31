import { expect } from 'chai';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import React from 'react';
import sinon from 'sinon';

import { AsyncTypeahead } from '../../src';
import { change, focus, getMenuItems, keyDown, search } from '../helpers';
import { DOWN, RETURN } from '../../src/constants';

describe('<AsyncTypeahead>', () => {
  let onSearch, wrapper;

  beforeEach(() => {
    onSearch = sinon.spy();
    wrapper = mount(
      <AsyncTypeahead
        delay={0}
        isLoading={false}
        onChange={noop}
        onSearch={onSearch}
        selected={[]}
      />
    );
  });

  it('should display a search prompt when focused', () => {
    const promptText = 'Prompt text';

    wrapper.setProps({
      minLength: 0,
      promptText,
    });

    focus(wrapper);
    const menuItems = getMenuItems(wrapper);

    expect(menuItems.length).to.equal(1);
    expect(menuItems.text()).to.equal(promptText);
  });

  it('should display the search text while searching', (done) => {
    const searchText = 'Search text';

    wrapper.setProps({ searchText });

    search(wrapper, 'search', () => {
      focus(wrapper);
      const menuItems = getMenuItems(wrapper);

      expect(menuItems.length).to.equal(1);
      expect(menuItems.text()).to.equal(searchText);
      done();
    });
  });

  it('should display the empty label if there are no results', (done) => {
    const emptyLabel = 'empty label';

    wrapper.setProps({
      emptyLabel,
      isLoading: true,
      useCache: false,
    });

    search(wrapper, 'search', () => {
      wrapper.setProps({ isLoading: false });

      focus(wrapper);
      const menuItems = getMenuItems(wrapper);

      expect(menuItems.length).to.equal(1);
      expect(menuItems.text()).to.equal(emptyLabel);
      done();
    });
  });

  it('should delay the search by at least the specified amount', (done) => {
    const delay = 100;
    const preSearch = Date.now();

    wrapper = mount(
      <AsyncTypeahead
        delay={delay}
        isLoading={false}
        onSearch={(query) => {
          expect(Date.now() - preSearch).to.be.at.least(delay);
          done();
        }}
      />
    );

    // Perform search.
    change(wrapper, 'search');
  });

  it('should not call onSearch when a selection is made', (done) => {
    let selected = [];

    wrapper.setProps({
      minLength: 0,
      onChange: (s) => selected = s,
    });

    search(wrapper, 'o', () => {
      wrapper.setProps({
        options: ['one', 'two', 'four'],
      });

      focus(wrapper);
      keyDown(wrapper, DOWN);
      keyDown(wrapper, RETURN);

      expect(selected.length).to.equal(1);
      expect(onSearch.calledOnce).to.equal(true);
      done();
    });
  });

  it('should use cached results and not perform a new search', (done) => {
    wrapper.setProps({ isLoading: true });

    // Initial search
    search(wrapper, 'search', () => {
      wrapper.setProps({
        isLoading: false,
        options: [],
      });

      expect(onSearch.callCount).to.equal(1);

      // Second search
      search(wrapper, 'newSearch', () => {
        wrapper.setProps({
          isLoading: false,
          options: [],
        });

        expect(onSearch.callCount).to.equal(2);

        // Perform the original search again.
        search(wrapper, 'search', () => {
          expect(onSearch.callCount).to.equal(2);
          done();
        });
      });
    });
  });

  it('should not use cached results', (done) => {
    wrapper.setProps({
      isLoading: true,
      useCache: false,
    });

    // Initial search
    search(wrapper, 'search', () => {
      wrapper.setProps({ isLoading: false, options: [] });
      expect(onSearch.callCount).to.equal(1);

      // Perform the search again.
      search(wrapper, 'search', () => {
        expect(onSearch.callCount).to.equal(2);
        done();
      });
    });
  });

  it('should perform a search when there is already a selection', (done) => {
    wrapper.setProps({
      multiple: true,
      onChange: () => {},
      options: ['one', 'two'],
      selected: ['one'],
    });

    search(wrapper, 'two', () => {
      expect(onSearch.callCount).to.equal(1);
      done();
    });
  });

  it('receives an event as the second argument of `onInputChange`', () => {
    wrapper.setProps({
      onInputChange: (text, e) => {
        expect(text).to.equal('x');
        expect(e).to.not.equal(undefined);
      },
    });

    change(wrapper, 'x');
  });

  it('adds a custom option when exact match is found ' +
      'and `allowNew` returns true', (done) => {
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
        isLoading: false,
        options: [text],
      });

      focus(wrapper);
      const menuItems = getMenuItems(wrapper);

      expect(menuItems.length).to.equal(2);
      expect(menuItems.at(0).text()).to.equal(text);
      expect(menuItems.at(1).text()).to.equal(`${newSelectionPrefix}${text}`);
      done();
    });
  });
});
