import React, { KeyboardEvent, useEffect } from 'react';
import usePrevious from '@restart/hooks/usePrevious';

import { TypeaheadContext, TypeaheadContextType } from './Context';
import {
  getHintText,
  getInputProps,
  getInputText,
  getIsOnlyResult,
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
  } = props;

  const prevProps = usePrevious(props);

  useEffect(() => {
    // Clear the initial item when there are no results.
    if (!(allowNew || results.length)) {
      onInitialItemChange();
    }
  });

  useEffect(() => {
    if (prevProps && prevProps.isMenuShown !== isMenuShown) {
      onMenuToggle(isMenuShown);
    }
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (initialItem && getIsOnlyResult(props)) {
          onAdd(initialItem);
        }
        break;
      default:
        break;
    }
    onKeyDown(e);
  };

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
    hintText: getHintText(props),
    isOnlyResult: getIsOnlyResult(props),
  };

  return (
    <TypeaheadContext.Provider value={contextValue}>
      {children(childProps)}
    </TypeaheadContext.Provider>
  );
};

export default TypeaheadManager;
