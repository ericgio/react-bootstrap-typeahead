import React from 'react';

import { TypeaheadContext } from './Context';
import { getInputProps, getInputText, isFunction } from '../utils';
import { TypeaheadManagerProps } from '../types';

const TypeaheadManager = (props: TypeaheadManagerProps) => {
  const { activeIndex, children, id, isMenuShown, onKeyDown } = props;

  const childProps = {
    getInputProps: getInputProps({
      activeIndex,
      disabled: props.disabled,
      id,
      inputRef: props.inputRef,
      isFocused: props.isFocused,
      isMenuShown,
      multiple: props.multiple,
      onBlur: props.onBlur,
      onChange: props.onChange,
      onClick: props.onClick,
      onFocus: props.onFocus,
      onKeyDown,
      placeholder: props.placeholder,
      value: getInputText(props),
    }),
    hideMenu: props.hideMenu,
    isMenuShown,
    labelKey: props.labelKey,
    onClear: props.onClear,
    onHide: props.onHide,
    onRemove: props.onRemove,
    results: props.results,
    selected: props.selected,
    text: props.text,
    toggleMenu: props.toggleMenu,
  };

  const contextValue = {
    activeIndex,
    hintText: props.hintText,
    id,
    initialItem: props.initialItem,
    inputNode: props.inputNode,
    isOnlyResult: props.isOnlyResult,
    onAdd: props.onAdd,
    onInitialItemChange: props.onInitialItemChange,
    onMenuItemClick: props.onMenuItemClick,
    setItem: props.setItem,
  };

  return (
    <TypeaheadContext.Provider value={contextValue}>
      {isFunction(children) ? children(childProps) : children}
    </TypeaheadContext.Provider>
  );
};

export default TypeaheadManager;
