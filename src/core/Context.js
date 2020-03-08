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
  items: Option[],
  onActiveItemChange: OptionHandler,
  onAdd: OptionHandler,
  onInitialItemChange: (?Option) => void,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  selectHintOnEnter: boolean,
};

export const TypeaheadContext: Context<TypeaheadContextType> =
  createContext({
    activeIndex: -1,
    hintText: '',
    id: '',
    initialItem: null,
    inputNode: null,
    isOnlyResult: false,
    items: [],
    onActiveItemChange: noop,
    onAdd: noop,
    onInitialItemChange: noop,
    onMenuItemClick: noop,
    selectHintOnEnter: false,
  });

export const useTypeaheadContext = () => useContext(TypeaheadContext);
