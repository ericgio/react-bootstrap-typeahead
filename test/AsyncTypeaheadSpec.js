import {expect} from 'chai';
import {mount} from 'enzyme';
import {noop} from 'lodash';
import React from 'react';
import sinon from 'sinon';

import {AsyncTypeahead} from '../src/';
import {focusTypeaheadInput, performSearch, scryMenuItems, updateProps} from './testUtils';

function change(wrapper, value) {
  getInput(wrapper).prop('onChange')({target: {value}});
}

function focus(wrapper) {
  getInput(wrapper).simulate('focus');
}

function getInput(wrapper) {
  return wrapper.find('.rbt-input-main');
}

function getMenuItems(wrapper) {
  return wrapper.find('li');
}

function search(wrapper, query, callback) {
  getInput(wrapper).simulate('change', {target: {value: query}})
  setTimeout(callback, wrapper.props().delay);
}

describe('<AsyncTypeahead>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <AsyncTypeahead
        delay={0}
        isLoading={false}
        onSearch={noop}
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

    wrapper.setProps({searchText});

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
      useCache: false,
    });

    search(wrapper, 'search', () => {
      wrapper.setState({requestPending: false}, () => {
        focus(wrapper);
        const menuItems = getMenuItems(wrapper);

        expect(menuItems.length).to.equal(1);
        expect(menuItems.text()).to.equal(emptyLabel);
        done();
      });
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

  it('should use cached results and not perform a new search', (done) => {
    let searchCount = 0;

    const onSearch = sinon.spy();

    wrapper.setProps({
      isLoading: true,
      // onSearch: (query) => searchCount++,
      onSearch,
    });

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
    const onSearch = sinon.spy();

    wrapper.setProps({
      isLoading: true,
      onSearch,
      useCache: false,
    });

    // Initial search
    search(wrapper, 'search', () => {
      wrapper.setProps({isLoading: false, options: []});
      expect(onSearch.callCount).to.equal(1);

      // Perform the search again.
      search(wrapper, 'search', () => {
        expect(onSearch.callCount).to.equal(2);
        done();
      });
    });
  });

  it('should perform a search when there is already a selection', (done) => {
    const onSearch = sinon.spy();

    wrapper.setProps({
      multiple: true,
      onSearch,
      options: ['one', 'two'],
      selected: ['one'],
    });

    // wrapper.setState({hasSelection: true});

    search(wrapper, 'two', () => {
      expect(onSearch.callCount).to.equal(1);
      done();
    });
  });

});
