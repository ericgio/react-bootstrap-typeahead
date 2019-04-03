// @flow

import React from 'react';

import { TypeaheadContext } from './Context';
import { getHintText, getInputProps, getInputText, getIsOnlyResult, pick } from '../utils';
import { RETURN } from '../constants';

import type { TypeaheadContextType } from './Context';
import type { TypeaheadInnerProps } from '../types';

const inputPropKeys = [
  'activeIndex',
  'disabled',
  'id',
  'inputRef',
  'isFocused',
  'isMenuShown',
  'labelKey',
  'multiple',
  'onBlur',
  'onChange',
  'onFocus',
  'onKeyDown',
  'onRemove',
  'placeholder',
  'selected',
];

const overlayPropKeys = [
  'align',
  'dropup',
  'flip',
  'onMenuToggle',
  'positionFixed',
];

const stateKeys = [
  'activeIndex',
  'isMenuShown',
  'labelKey',
  'onClear',
  'results',
  'selected',
  'text',
];

const typeaheadContextKeys = [
  'activeIndex',
  'id',
  'initialItem',
  'onActiveItemChange',
  'onAdd',
  'onInitialItemChange',
  'onMenuItemClick',
  'selectHintOnEnter',
];

const getOverlayProps = ({ isMenuShown, referenceElement }) => (props) => ({
  ...pick(props, overlayPropKeys),
  isMenuShown,
  referenceElement,
});

function getTypeaheadContextValue(
  props: TypeaheadInnerProps
): TypeaheadContextType {
  return {
    ...pick(props, typeaheadContextKeys),
    hintText: getHintText(props),
    isOnlyResult: getIsOnlyResult(props),
  };
}

class TypeaheadInnerManager extends React.Component<TypeaheadInnerProps> {
  componentDidUpdate(prevProps: TypeaheadInnerProps) {
    const { allowNew, onInitialItemChange, results } = this.props;

    // Clear the initial item when there are no results.
    if (!(allowNew || results.length)) {
      onInitialItemChange(null);
    }
  }

  render() {
    const childProps = {
      getInputProps: getInputProps({
        ...pick(this.props, inputPropKeys),
        onKeyDown: this._handleKeyDown,
        ref: this.props.getReferenceElement,
        value: getInputText(this.props),
      }),
      getOverlayProps: getOverlayProps(this.props),
      state: pick(this.props, stateKeys),
    };

    return (
      <TypeaheadContext.Provider value={getTypeaheadContextValue(this.props)}>
        {this.props.children(childProps)}
      </TypeaheadContext.Provider>
    );
  }

  _handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { initialItem, onKeyDown, onAdd } = this.props;

    switch (e.keyCode) {
      case RETURN:
        if (initialItem && getIsOnlyResult(this.props)) {
          onAdd(initialItem);
        }
        break;
      default:
        break;
    }

    onKeyDown(e);
  }
}

export default TypeaheadInnerManager;
