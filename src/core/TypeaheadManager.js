// @flow

import React from 'react';

import { TypeaheadContext } from './Context';
import { getHintText, getInputProps, getInputText, getIsOnlyResult, pick } from '../utils';
import { RETURN } from '../constants';

import type { TypeaheadContextType } from './Context';
import type { TypeaheadManagerProps } from '../types';

const inputPropKeys = [
  'activeIndex',
  'disabled',
  'id',
  'inputRef',
  'isFocused',
  'isMenuShown',
  'multiple',
  'onBlur',
  'onChange',
  'onFocus',
  'onKeyDown',
  'placeholder',
];

const stateKeys = [
  'activeIndex',
  'isMenuShown',
  'labelKey',
  'onClear',
  'onHide',
  'onRemove',
  'results',
  'selected',
  'text',
];

const typeaheadContextKeys = [
  'activeIndex',
  'id',
  'initialItem',
  'items',
  'onActiveItemChange',
  'onAdd',
  'onInitialItemChange',
  'onMenuItemClick',
  'selectHintOnEnter',
];

function getTypeaheadContextValue(
  props: TypeaheadManagerProps
): TypeaheadContextType {
  return {
    ...pick(props, typeaheadContextKeys),
    hintText: getHintText(props),
    isOnlyResult: getIsOnlyResult(props),
  };
}

class TypeaheadManager extends React.Component<TypeaheadManagerProps> {
  componentDidUpdate(prevProps: TypeaheadManagerProps) {
    const {
      allowNew,
      isMenuShown,
      onInitialItemChange,
      onMenuToggle,
      results,
    } = this.props;

    // Clear the initial item when there are no results.
    if (!(allowNew || results.length)) {
      onInitialItemChange(null);
    }

    if (isMenuShown !== prevProps.isMenuShown) {
      onMenuToggle(isMenuShown);
    }
  }

  render() {
    const childProps = {
      getInputProps: getInputProps({
        ...pick(this.props, inputPropKeys),
        onKeyDown: this._handleKeyDown,
        value: getInputText(this.props),
      }),
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

export default TypeaheadManager;
