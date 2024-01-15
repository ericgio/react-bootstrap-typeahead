import React, { KeyboardEvent, useEffect, useRef } from 'react';

import { TypeaheadContext, TypeaheadContextType } from './Context';
import {
  defaultSelectHint,
  getHintText,
  getInputProps,
  getInputText,
  getIsOnlyResult,
  isFunction,
  pick,
} from '../utils';
import { TypeaheadManagerProps } from '../types';

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
  'onClick',
  'onFocus',
  'onKeyDown',
  'placeholder',
] as (keyof TypeaheadManagerProps)[];

const propKeys = [
  'activeIndex',
  'hideMenu',
  'isMenuShown',
  'labelKey',
  'onClear',
  'onHide',
  'onRemove',
  'results',
  'selected',
  'text',
  'toggleMenu',
] as (keyof TypeaheadManagerProps)[];

const contextKeys = [
  'activeIndex',
  'id',
  'initialItem',
  'inputNode',
  'onActiveItemChange',
  'onAdd',
  'onInitialItemChange',
  'onMenuItemClick',
  'onSelectAllClick',
  'setItem',
] as (keyof TypeaheadManagerProps)[];

const TypeaheadManager = (props: TypeaheadManagerProps) => {
  const {
    allowNew,
    children,
    initialItem,
    isMenuShown,
    onAdd,
    onInitialItemChange,
    onKeyDown,
    onMenuToggle,
    results,
    selectHint,
    onSelectAllClick
  } = props;

  const hintText = getHintText(props);

  useEffect(() => {
    // Clear the initial item when there are no results.
    if (!(allowNew || results.length)) {
      onInitialItemChange();
    }
  });

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    onMenuToggle(isMenuShown);
  }, [isMenuShown, onMenuToggle]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown(e);

    if (!initialItem) {
      return;
    }

    const addOnlyResult = e.key === 'Enter' && getIsOnlyResult(props);
    const shouldSelectHint = hintText && defaultSelectHint(e, selectHint);

    if (addOnlyResult || shouldSelectHint) {
      onAdd(initialItem);
    }
  };

  const handleSelectAll = () => {
    onSelectAllClick(results)
  }

  const childProps = {
    ...pick(props, propKeys),
    getInputProps: getInputProps({
      ...pick(props, inputPropKeys),
      onKeyDown: handleKeyDown,
      value: getInputText(props),
    }),
  };

  const contextValue: TypeaheadContextType = {
    ...pick(props, contextKeys),
    hintText,
    isOnlyResult: getIsOnlyResult(props),
    onSelectAllClick: handleSelectAll
  };

  return (
    <TypeaheadContext.Provider value={contextValue}>
      {isFunction(children) ? children(childProps) : children}
    </TypeaheadContext.Provider>
  );
};

export default TypeaheadManager;
