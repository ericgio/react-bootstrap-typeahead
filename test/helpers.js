import {noop} from 'lodash';

export const context = {
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  results: [],
  selectHintOnEnter: false,
};

// Make sure e.persist() is present in events.
const baseEvent = {
  persist: noop,
};

/**
 * Finding React Elements
 */
export function getHint(wrapper) {
  return wrapper.find('.rbt-input-hint').prop('value');
}

export function getInput(wrapper) {
  return wrapper.find('.rbt-input-main');
}

export function getMenu(wrapper) {
  return wrapper.find('.rbt-menu').hostNodes();
}

export function getMenuItems(wrapper) {
  // Rather than finding the <li> node, find the <a> so we can simulate clicks
  // if needed. This also skips over things like menu item dividers.
  return wrapper.find('a.dropdown-item');
}

export function getPaginator(wrapper) {
  return wrapper.find('.rbt-menu-pagination-option').hostNodes();
}

export function getTokens(wrapper) {
  return wrapper.find('.rbt-token');
}

/**
 * Events
 */
export function focus(wrapper) {
  getInput(wrapper).simulate('focus', baseEvent);
}

export function keyDown(wrapper, value) {
  getInput(wrapper).simulate('keyDown', {
    ...baseEvent,
    keyCode: value,
    which: value,
  });
}

export function change(wrapper, value) {
  // Calling `simulate` doesn't actually change the value, so call the
  // `onChange` prop directly: https://github.com/airbnb/enzyme/issues/1412
  getInput(wrapper).prop('onChange')({...baseEvent, target: {value}});
}

export const cssModulesFixture = {
  active: 'active___1QeAJ',
  clearfix: 'clearfix___3XuW4',
  col: 'col___16TWV',
  'col-form-label': 'col-form-label___2yZrn',
  'col-form-label-lg': 'col-form-label-lg___NzIgu',
  'col-form-label-sm': 'col-form-label-sm___28vle',
  'custom-control': 'custom-control___1aXd3',
  'custom-control-input': 'custom-control-input___1vgDI',
  'custom-control-label': 'custom-control-label___3ReCO',
  'custom-file-input': 'custom-file-input___3WGDY',
  'custom-file-label': 'custom-file-label___3vX64',
  'custom-select': 'custom-select___3q_J5',
  disabled: 'disabled___1fCMP',
  dropdown: 'dropdown___dePZ-',
  'dropdown-divider': 'dropdown-divider___3bH91',
  'dropdown-header': 'dropdown-header___2O5kO',
  'dropdown-item': 'dropdown-item___1vqsv',
  'dropdown-item-text': 'dropdown-item-text___3e_8i',
  'dropdown-menu': 'dropdown-menu___3kr8t',
  'dropdown-menu-left': 'dropdown-menu-left___3aUGn',
  'dropdown-menu-lg-left': 'dropdown-menu-lg-left___2zCg0',
  'dropdown-menu-lg-right': 'dropdown-menu-lg-right___1dFEM',
  'dropdown-menu-md-left': 'dropdown-menu-md-left___3ZmeY',
  'dropdown-menu-md-right': 'dropdown-menu-md-right___BSaMG',
  'dropdown-menu-right': 'dropdown-menu-right___3KUg9',
  'dropdown-menu-sm-left': 'dropdown-menu-sm-left___23feA',
  'dropdown-menu-sm-right': 'dropdown-menu-sm-right___3YHMF',
  'dropdown-menu-xl-left': 'dropdown-menu-xl-left___20EJk',
  'dropdown-menu-xl-right': 'dropdown-menu-xl-right___1mcOS',
  'dropdown-menu-xxl-left': 'dropdown-menu-xxl-left___2FmOL',
  'dropdown-menu-xxl-right': 'dropdown-menu-xxl-right___1MJfW',
  'dropdown-toggle': 'dropdown-toggle___MX2df',
  dropleft: 'dropleft___1248F',
  dropright: 'dropright___1iktG',
  dropup: 'dropup___3Exmt',
  focus: 'focus___1Sh7B',
  'form-check': 'form-check___28iaS',
  'form-check-inline': 'form-check-inline___XBCf1',
  'form-check-input': 'form-check-input___312C9',
  'form-check-label': 'form-check-label___2VlM2',
  'form-control': 'form-control___2KhJw',
  'form-control-file': 'form-control-file___2EkAT',
  'form-control-lg': 'form-control-lg___1uXe2',
  'form-control-plaintext': 'form-control-plaintext___k2jP-',
  'form-control-range': 'form-control-range___31AUN',
  'form-control-sm': 'form-control-sm___3k5c0',
  'form-group': 'form-group___NwlHY',
  'form-inline': 'form-inline___1LDx2',
  'form-row': 'form-row___1_VrR',
  'form-text': 'form-text___TOHGC',
  'input-group': 'input-group___13-gO',
  'invalid-feedback': 'invalid-feedback___3GKI5',
  'invalid-tooltip': 'invalid-tooltip___3JB5y',
  'is-invalid': 'is-invalid___35wm-',
  'is-valid': 'is-valid___28iTl',
  rbt: 'rbt___359mb',
  'rbt-input-hint-container': 'rbt-input-hint-container___3XEbO',
  'rbt-input-main': 'rbt-input-main___3AuWk',
  'rbt-input-multi': 'rbt-input-multi___odCTl',
  show: 'show___RfU99',
  typeahead__input_field__icon: 'typeahead__input_field__icon___1Ntm5',
  'valid-feedback': 'valid-feedback___p6tYX',
  'valid-tooltip': 'valid-tooltip___3fHmS',
  'was-validated': 'was-validated___1staH',
};
