import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

import {AsyncTypeahead} from '../src/';
import {getMenuNode, performSearch, updateProps} from './testUtils';

const defaultProps = {
  delay: 0,
  onSearch() {},
};

export function getTypeaheadInstance(props) {
  return TestUtils.renderIntoDocument(<AsyncTypeahead {...props} />);
}

describe('<AsyncTypeahead>', () => {

  it('should display a search prompt when focused', () => {
    const promptText = 'Prompt text';
    const instance = getTypeaheadInstance({
      ...defaultProps,
      minLength: 0,
      promptText,
    });

    const menuNode = getMenuNode(instance);
    const menuItems = menuNode.children;

    expect(menuItems.length).to.equal(1);
    expect(menuItems[0].children[0].innerHTML).to.equal(promptText);
  });

  it('should display the search text while searching', done => {
    const searchText = 'Search text';
    const instance = getTypeaheadInstance({
      ...defaultProps,
      searchText,
    });

    performSearch('search', instance, () => {
      const menuNode = getMenuNode(instance);
      const menuItems = menuNode.children;

      expect(menuItems.length).to.equal(1);
      expect(menuItems[0].children[0].innerHTML).to.equal(searchText);
      done();
    });
  });

  it('should display the empty label if there are no results', done => {
    const emptyLabel = 'empty label';
    const instance = getTypeaheadInstance({
      ...defaultProps,
      emptyLabel,
      useCache: false,
    });

    performSearch('search', instance, () => {
      instance.setState({requestPending: false}, () => {
        const menuNode = getMenuNode(instance);
        const menuItems = menuNode.children;

        expect(menuItems.length).to.equal(1);
        expect(menuItems[0].children[0].innerHTML).to.equal(emptyLabel);
        done();
      });
    });
  });

  it('should delay the search by at least the specified amount', done => {
    let beforeSearch = new Date();
    let afterSearch = new Date();

    const delay = 100;
    const instance = getTypeaheadInstance({
      delay,
      onSearch(query) {
        afterSearch = new Date();
      },
    });

    performSearch('search', instance, () => {
      const actualDelay = afterSearch.getTime() - beforeSearch.getTime();
      expect(actualDelay).to.be.at.least(delay);
      done();
    });
  });

  it('should use cached results and not perform a new search', done => {
    let searchCount = 0;

    const instance = getTypeaheadInstance({
      ...defaultProps,
      onSearch: query => searchCount++,
    });

    // Initial search
    performSearch('search', instance, () => {
      updateProps(instance, {options: []});
      expect(searchCount).to.equal(1);

      // Second search
      performSearch('newSearch', instance, () => {
        updateProps(instance, {options: []});
        expect(searchCount).to.equal(2);

        // Perform the original search again.
        performSearch('search', instance, () => {
          expect(searchCount).to.equal(2);
          done();
        });
      });
    });
  });

  it('should not use cached results', done => {
    let searchCount = 0;

    const instance = getTypeaheadInstance({
      ...defaultProps,
      onSearch: query => searchCount++,
      useCache: false,
    });

    // Initial search
    performSearch('search', instance, () => {
      updateProps(instance, {options: []});
      expect(searchCount).to.equal(1);

      // Perform the search again.
      performSearch('search', instance, () => {
        expect(searchCount).to.equal(2);
        done();
      });
    });
  });

  it('should perform a search when there is already a selection', done => {
    let searchCount = 0;

    const instance = getTypeaheadInstance({
      ...defaultProps,
      multiple: true,
      options: ['one', 'two'],
      onSearch: query => searchCount++,
      selected: ['one'],
    });
    instance.state.hasSelection = true;

    performSearch('two', instance, () => {
      expect(searchCount).to.equal(1);
      done();
    });
  });

});
