import {expect} from 'chai';

import {render, fireEvent, cleanup} from 'react-testing-library';

import React from 'react';

import {Typeahead} from '../src/';

import states from '../example/exampleData';


function renderTypeahead(props) {
  return render(
    <Typeahead
      labelKey="name"
      options={states}
      {...props}
    />
  );
}

function getMenu(wrapper) {
  return wrapper.container.querySelector('.rbt-menu');
} // getMenu

function getMenuItems(wrapper) {
  let menu = getMenu(wrapper);
  return menu? menu.querySelectorAll('li') : [];
} // getMenuItems

describe('test a11y status', () => {
  let delayTime = 1500;

  let delay = (_delay = delayTime) => {
    let startTime = Date.now();
    let fudgeFactor = 5;
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        try {resolve(Date.now() - startTime - fudgeFactor);}
        catch (e) {resolve(e);}
      }, _delay);
    }); // new Promise
  }; // delay

  afterEach(cleanup);


  it('shows number of results when menu appears', () => {
    let typeahead = renderTypeahead({minLength: 1});
    let statusNode = typeahead.container.querySelector('.rbt-sr-status');
    let input = typeahead.container.querySelector('.rbt-input-main');
    input.focus();

    expect(getMenuItems(typeahead).length).to.equal(0);
    input.value = 'm';
    fireEvent.change(input);
    expect(getMenuItems(typeahead).length).to.equal(14);

    return delay().then(() => {
      expect(statusNode.textContent).to.contain('14 results');
    });
  });

  it('shows number of results when menu length changes', () => {
    let typeahead = renderTypeahead({minLength: 1, multiple: true});
    let statusNode = typeahead.container.querySelector('.rbt-sr-status');
    let input = typeahead.container.querySelector('.rbt-input-main');
    input.focus();

    expect(getMenuItems(typeahead).length).to.equal(0);
    input.value = 'ma';
    fireEvent.change(input);
    expect(getMenuItems(typeahead).length).to.equal(5);

    return delay().then(() => {
      expect(statusNode.textContent).to.contain('5 results');
    });
  });

  it('shows number of selected when multiple is set', () => {
    let typeahead = renderTypeahead({
      defaultSelected: states.slice(0, 5),
      multiple: true,
    });
    let statusNode = typeahead.container.querySelector('.rbt-sr-status');
    let input = typeahead.container.querySelector('.rbt-input-main');
    input.focus();
    expect(document.activeElement).to.equal(input);
    //expect(getMenuItems(typeahead).length).to.equal(45);
    //expect(input.getAttribute('aria-activedescendant')).to.equal('');

    return delay().then((time) => {
      expect(statusNode.textContent).to.contain('5 selected');
    });

  });

}); // describe
