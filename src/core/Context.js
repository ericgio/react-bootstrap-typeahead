// @flow

import { type Context, createContext, useContext } from 'react';

import { noop } from '../utils';

import type { Id, Option, OptionHandler } from '../types';

export type TypeaheadContextType = {
  activeIndex: number,
  hintText: string,
  id: Id,
  initialItem: ?Option,
  inputNode: ?HTMLInputElement,
  isOnlyResult: boolean,
  onActiveItemChange: OptionHandler,
  onAdd: OptionHandler,
  onInitialItemChange: (?Option) => void,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  selectHintOnEnter: boolean,
  setItem: (Option, number) => void,
  value: string,
};

export const TypeaheadContext: Context<TypeaheadContextType> =
  createContext({
    activeIndex: -1,
    hintText: '',
    id: '',
    initialItem: null,
    inputNode: null,
    isOnlyResult: false,
    onActiveItemChange: noop,
    onAdd: noop,
    onInitialItemChange: noop,
    onMenuItemClick: noop,
    selectHintOnEnter: false,
    setItem: noop,
    value: '',
  });

export const useTypeaheadContext = () => useContext(TypeaheadContext);
