import {expect} from 'chai';
import {Simulate} from 'enzyme';

import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'
import ReactTestUtils from 'react-dom/test-utils';

import {head} from 'lodash';
import React from 'react';
import {Popper} from 'react-popper';
import sinon from 'sinon';

import {Menu, MenuItem, Typeahead} from '../../src/';

//import {change, focus, getHint, getInput, getMenu, getMenuItems, getPaginator, getTokens, keyDown} from '../helpers';
//import {keyDown} from '../helpers';
import states from '../../example/exampleData';
import {DOWN, ESC, RETURN, RIGHT, TAB, UP} from '../../src/constants/keyCode';

function keyDown(node, key) {
  var event = document.createEvent('Event');
  event.key = key;
  event.initEvent('keydown', true, true);
  node.dispatchEvent(event);
}
function downArrow (node) {
  return keyDown (node, 'ArrowDown');
} // downArrow

function enterKey (node) {
  return keyDown (node, 'ArrowDown');
} // enterKey



function renderTypeahead(props) {
  return render(
    <Typeahead
      labelKey="name"
      options={states}
      {...props}
    />
  );
}

function mountTypeahead(props) {
  return mount(
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
  return menu? menu.querySelectorAll("li") : [];
} // getMenuItems

describe('test a11y status', () => {
  let delayTime = 1500;

    let delay = (_delay = delayTime) => {
      let startTime = Date.now();
      let fudgeFactor = 5;
      return new Promise (function (resolve, reject) {
        setTimeout (() => {
          try {resolve(Date.now() - startTime - fudgeFactor);}
          catch(e) {resolve(e);}
        }, _delay);
      }); // new Promise
    } // delay

    let typeahead, statusNode, input, menu;

  afterEach(cleanup);

  /*beforeEach(() => {
    typeahead = renderTypeahead({minLength: 1, multiple: true});
    statusNode = typeahead.container.querySelector('.rbt-sr-status');
    input = typeahead.container.querySelector('.rbt-input-main');
    input.focus();
  });
  */


  it('shows number of results when menu appears', () => {
    let typeahead = renderTypeahead({minLength: 1});
    let statusNode = typeahead.container.querySelector('.rbt-sr-status');
    let input = typeahead.container.querySelector('.rbt-input-main');
    input.focus();

    expect(getMenuItems(typeahead).length).to.equal(0);
    input.value = "m";
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
    input.value = "ma";
    fireEvent.change(input);
    expect(getMenuItems(typeahead).length).to.equal(5);

    return delay().then(() => {
      expect(statusNode.textContent).to.contain('5 results');
    });
  });

  it('shows number of selected when multiple is set', () => {
    let typeahead = renderTypeahead({multiple: true, defaultSelected: states.slice(0,5)});
    let statusNode = typeahead.container.querySelector('.rbt-sr-status');
    let input = typeahead.container.querySelector('.rbt-input-main');
    input.focus();
    expect(document.activeElement).to.equal(input);
    expect(getMenuItems(typeahead).length).to.equal(45);
    expect(input.getAttribute('aria-activedescendant')).to.equal('');

    return delay().then((time) => {
        console.log("after: ", time, statusNode.textContent);
        expect(statusNode.textContent).to.contain('5 selected');
      });

  });

}); // describe
