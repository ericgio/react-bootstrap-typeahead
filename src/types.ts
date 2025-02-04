import {
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  RefCallback,
} from 'react';

import { ALIGN_VALUES, SIZES } from './constants';

export type Align = (typeof ALIGN_VALUES)[number];

export type AllowNew =
  | boolean
  | ((options: Option[], state: TypeaheadState) => boolean);

export type FilterByCallback = (
  option: Option,
  state: TypeaheadState
) => boolean;

export type Id = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Option = string | Record<string, any>;

export type OptionHandler = (option: Option) => void;

export type LabelKey = string | ((option: Option) => string);

export type SelectEvent<T> = MouseEvent<T> | KeyboardEvent<T>;

export type SelectHint = (
  shouldSelectHint: boolean,
  event: KeyboardEvent<HTMLInputElement>
) => boolean;

export type Size = (typeof SIZES)[number];

export interface TypeaheadInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputClassName?: string;
  inputRef: RefCallback<HTMLInputElement>;
  referenceElementRef: RefCallback<HTMLElement>;
}

export interface TypeaheadState {
  activeIndex: number;
  activeItem?: Option;
  initialItem?: Option;
  isFocused: boolean;
  selected: Option[];
  showMenu: boolean;
  text: string;
}
