import { createContext, useContext } from 'react';

import { noop } from '../utils';
import { Id, Option, OptionHandler } from '../types';

export interface TypeaheadContextType {
  activeIndex: number;
  hintText: string;
  id?: Id;
  initialItem?: Option;
  inputNode: HTMLInputElement | null;
  isOnlyResult: boolean;
  onAdd: OptionHandler;
  onInitialItemChange: (option?: Option) => void;
  setItem: (option: Option, position: number) => void;
}

export const defaultContext = {
  activeIndex: -1,
  hintText: '',
  id: '',
  initialItem: undefined,
  inputNode: null,
  isOnlyResult: false,
  onAdd: noop,
  onInitialItemChange: noop,
  setItem: noop,
};

export const TypeaheadContext =
  createContext<TypeaheadContextType>(defaultContext);

export const useTypeaheadContext = () => useContext(TypeaheadContext);
