import {noop, range} from 'lodash';
import PropTypes from 'prop-types';

export const bigDataSet = range(0, 300).map((o) => ({name: o.toString()}));

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

/* Events */
export function focus(wrapper) {
  getInput(wrapper).simulate('focus');
}

export function keyDown(wrapper, value) {
  getInput(wrapper).simulate('keyDown', {
    keyCode: value,
    which: value,
  });
}

export function change(wrapper, value) {
  // Calling `simulate` doesn't actually change the value, so call the
  // `onChange` prop directly: https://github.com/airbnb/enzyme/issues/1412
  getInput(wrapper).prop('onChange')({target: {value}});
}


/* Finding React Elements */
export function getHint(wrapper) {
  return wrapper.find('.rbt-input-hint');
}

export function getInput(wrapper) {
  return wrapper.find('.rbt-input-main');
}

export function getMenu(wrapper) {
  return wrapper.find('.rbt-menu').hostNodes();
}

export function getMenuItems(wrapper) {
  return wrapper.find('li');
}

export function getPaginator(wrapper) {
  return wrapper.find('.rbt-menu-paginator').hostNodes();
}

/* Other Functions */
export function search(wrapper, query, callback) {
  getInput(wrapper).simulate('change', {target: {value: query}});
  setTimeout(callback, 100);
}
