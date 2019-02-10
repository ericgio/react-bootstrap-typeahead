import { noop, pick } from 'lodash';
import createReactContext from 'create-react-context';
import React from 'react';

export const TypeaheadContext = createReactContext({
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  selectHintOnEnter: false,
});

export const InputContext = createReactContext({
  activeIndex: -1,
  disabled: false,
  getReferenceElement: noop,
  id: '',
  inputProps: {},
  inputRef: noop,
  isFocused: false,
  isMenuShown: false,
  labelKey: '',
  multiple: false,
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  onKeyDown: noop,
  onRemove: noop,
  placeholder: '',
  ref: noop,
  selected: [],
});

export const MenuContext = createReactContext({
  align: '',
  dropup: false,
  flip: false,
  id: '',
  labelKey: '',
  onMenuToggle: noop,
  positionFixed: false,
  referenceElement: null,
  results: [],
  show: false,
  text: '',
});

export const withContext = (Component, values) => {
  // Note: Use a class instead of function component to support refs.
  /* eslint-disable-next-line react/prefer-stateless-function */
  return class extends React.Component {
    render() {
      return (
        <TypeaheadContext.Consumer>
          {(context) => (
            <Component {...this.props} {...pick(context, values)} />
          )}
        </TypeaheadContext.Consumer>
      );
    }
  };
};
