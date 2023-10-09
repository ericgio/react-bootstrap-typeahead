import { createContext, useContext } from 'react';

import { noop, once } from '../utils';
import { Id, OptionType, OptionHandler, SelectEvent } from '../types';

export interface TypeaheadContextType<Option extends OptionType> {
  activeIndex: number;
  hintText: string;
  id: Id;
  initialItem: Option | null;
  inputNode: HTMLInputElement | null;
  isOnlyResult: boolean;
  onActiveItemChange: OptionHandler<Option>;
  onAdd: OptionHandler<Option>;
  onInitialItemChange: (option?: Option) => void;
  onMenuItemClick: (option: Option, event: SelectEvent<HTMLElement>) => void;
  setItem: (option: Option, position: number) => void;
}

export const defaultContext = {
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
};

export const createTypeaheadContext = once(<Option extends OptionType>() => createContext<TypeaheadContextType<Option>>(defaultContext));
export const useTypeaheadContext = <Option extends OptionType>() => useContext(createTypeaheadContext<Option>());
