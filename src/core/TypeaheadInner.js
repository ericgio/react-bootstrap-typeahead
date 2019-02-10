import { pick } from 'lodash';
import React from 'react';

import { InputContext, MenuContext, TypeaheadContext } from './Context';
import { getHintText, getInputText, getIsOnlyResult } from '../utils';
import { RETURN } from '../constants';

function getTypeaheadContextValue(props) {
  const values = pick(props, [
    'activeIndex',
    'id',
    'initialItem',
    'onActiveItemChange',
    'onAdd',
    'onInitialItemChange',
    'onMenuItemClick',
    'selectHintOnEnter',
  ]);

  return {
    ...values,
    hintText: getHintText(props),
    isOnlyResult: getIsOnlyResult(props),
  };
}

function getInputContextValue(props) {
  const values = pick(props, [
    'activeIndex',
    'disabled',
    'id',
    'inputProps',
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
  ]);

  return {
    ...values,
    ref: props.getReferenceElement,
    value: getInputText(props),
  };
}

function getMenuContextValue(props) {
  const values = pick(props, [
    'align',
    'dropup',
    'flip',
    'id',
    'labelKey',
    'onMenuToggle',
    'positionFixed',
    'referenceElement',
    'results',
    'text',
  ]);

  return {
    ...values,
    show: props.isMenuShown,
  };
}

class TypeaheadInnerManager extends React.Component {
  componentDidUpdate(prevProps, prevState) {
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

  _handleKeyDown = (e) => {
    const { initialItem, onKeyDown, onAdd } = this.props;

    switch (e.keyCode) {
      case RETURN:
        if (getIsOnlyResult(this.props)) {
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
