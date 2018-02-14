import {head, noop} from 'lodash';
import PropTypes from 'prop-types';
import TestUtils from 'react-dom/test-utils';

export const childContextTypes = {
  activeIndex: PropTypes.number.isRequired,
  isOnlyResult: PropTypes.bool.isRequired,
  onActiveItemChange: PropTypes.func.isRequired,
  onInitialItemChange: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

export const context = {
  activeIndex: -1,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
};

export function focus(wrapper) {
  getInput(wrapper).simulate('focus');
}

export function focusTypeaheadInput(instance) {
  const inputNode = getInputNode(instance);
  TestUtils.Simulate.focus(inputNode);
}

export function getHint(wrapper) {
  return wrapper.find('.rbt-input-hint');
}

export function getHintNode(instance) {
  const nodes = TestUtils.scryRenderedDOMComponentsWithClass(
    instance,
    'rbt-input-hint'
  );
  return head(nodes);
}

export function getInput(wrapper) {
  return wrapper.find('.rbt-input-main');
}

export function getInputNode(instance) {
  return TestUtils.findRenderedDOMComponentWithClass(
    instance,
    'rbt-input-main'
  );
}

export function getMenuNode(instance) {
  const nodes = TestUtils.scryRenderedDOMComponentsWithClass(
    instance,
    'rbt-menu'
  );
  return head(nodes);
}

export function getMenuItems(wrapper) {
  return wrapper.find('li');
}

export function scryMenuItems(instance) {
  return TestUtils.scryRenderedDOMComponentsWithTag(
    instance,
    'LI'
  );
}

export function search(wrapper, query, callback) {
  getInput(wrapper).simulate('change', {target: {value: query}});
  setTimeout(callback, wrapper.props().delay);
}

export function simulateKeyDown(instance, keyCode) {
  const inputNode = getInputNode(instance);
  TestUtils.Simulate.focus(inputNode);
  TestUtils.Simulate.keyDown(inputNode, {
    keyCode,
    which: keyCode,
  });
}

export function updateInputValue(instance, value) {
  const inputNode = getInputNode(instance);
  TestUtils.Simulate.change(inputNode, {target: {value}});
}
