// @flow

import { pick } from 'lodash';
import React from 'react';

import { InputContext, InputContextKeys, MenuContext, MenuContextKeys, TypeaheadContext, TypeaheadContextKeys } from './Context';
import { getHintText, getInputText, getIsOnlyResult } from '../utils';
import { RETURN } from '../constants';

import type { InputContextType, MenuContextType, TypeaheadContextType } from './Context';
import type { TypeaheadInnerProps } from '../types';

function getTypeaheadContextValue(
  props: TypeaheadInnerProps
): TypeaheadContextType {
  return {
    ...pick(props, TypeaheadContextKeys),
    hintText: getHintText(props),
    isOnlyResult: getIsOnlyResult(props),
  };
}

function getInputContextValue(props: TypeaheadInnerProps): InputContextType {
  return {
    ...pick(props, InputContextKeys),
    ref: props.getReferenceElement,
    value: getInputText(props),
  };
}

function getMenuContextValue(props: TypeaheadInnerProps): MenuContextType {
  return {
    ...pick(props, MenuContextKeys),
    show: props.isMenuShown,
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
    const inputContext = {
      ...getInputContextValue(this.props),
      onKeyDown: this._handleKeyDown,
    };

    return (
      <TypeaheadContext.Provider value={getTypeaheadContextValue(this.props)}>
        <InputContext.Provider value={inputContext}>
          <MenuContext.Provider value={getMenuContextValue(this.props)}>
            {this.props.children(this.props)}
          </MenuContext.Provider>
        </InputContext.Provider>
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
