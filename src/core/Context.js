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
  setItem: (Option, number) => void,
};

export const TypeaheadContext: Context<TypeaheadContextType> = createContext({
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
  setItem: noop,
});

export const useTypeaheadContext = () => useContext(TypeaheadContext);
