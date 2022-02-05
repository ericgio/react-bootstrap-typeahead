import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  RefCallback,
  SyntheticEvent,
} from 'react';

import { SIZES } from './constants';

export type AllowNew =
  | boolean
  | ((options: Option[], state: TypeaheadPropsAndState) => boolean);

export type FilterByCallback = (
  option: Option,
  state: TypeaheadPropsAndState
) => void;

export type Id = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Option = string | Record<string, any>;

export type OptionHandler = (option: Option) => void;

export type LabelKey = string | ((option: Option) => string);

export type SelectEvent<T> = MouseEvent<T> | KeyboardEvent<T>;

export type ShouldSelect = (
  shouldSelectHint: boolean,
  event: KeyboardEvent<HTMLInputElement>
) => boolean;

export type RefElement<T> = T | null;

export type Size = typeof SIZES[number];

export type TypeaheadChildren =
  | ReactNode
  | ((props: TypeaheadManagerChildProps) => ReactNode);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  shouldSelectHint?: ShouldSelect;
}

export interface TypeaheadInputProps extends InputProps {
  inputClassName?: string;
  inputRef: RefCallback<HTMLInputElement>;
  referenceElementRef: RefCallback<HTMLElement>;
}

export interface RenderTokenProps {
  disabled?: boolean;
  labelKey: LabelKey;
  onRemove?: OptionHandler;
  tabIndex?: number;
}

export type RenderToken = (
  option: Option,
  props: RenderTokenProps,
  idx: number
) => JSX.Element;

export interface TypeaheadProps {
  allowNew: AllowNew;
  autoFocus: boolean;
  caseSensitive: boolean;
  children: TypeaheadChildren;
  defaultInputValue: string;
  defaultOpen: boolean;
  defaultSelected: Option[];
  emptyLabel?: ReactNode;
  filterBy: string[] | FilterByCallback;
  highlightOnlyResult: boolean;
  id?: Id;
  ignoreDiacritics: boolean;
  inputProps?: InputProps;
  labelKey: LabelKey;
  maxResults: number;
  minLength: number;
  multiple: boolean;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange?: (selected: Option[]) => void;
  onFocus: (event: SyntheticEvent<HTMLInputElement>) => void;
  onInputChange: (text: string, event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onMenuToggle: (isOpen: boolean) => void;
  onPaginate: (event: SelectEvent<HTMLElement>, shownResults: number) => void;
  open?: boolean;
  options: Option[];
  paginate: boolean;
  selected?: Option[];
  selectHintOnEnter?: boolean;
}

export interface TypeaheadState {
  activeIndex: number;
  activeItem?: Option;
  initialItem?: Option;
  isFocused: boolean;
  selected: Option[];
  showMenu: boolean;
  shownResults: number;
  text: string;
}

export type TypeaheadPropsAndState = Omit<TypeaheadProps, 'onChange'> &
  TypeaheadState;

export interface TypeaheadManagerChildProps {
  activeIndex: number;
  getInputProps: (props?: InputProps) => TypeaheadInputProps;
  hideMenu: () => void;
  isMenuShown: boolean;
  labelKey: LabelKey;
  onClear: () => void;
  onHide: () => void;
  onRemove: OptionHandler;
  results: Option[];
  selected: Option[];
  text: string;
  toggleMenu: () => void;
}

export interface TypeaheadManagerProps extends TypeaheadPropsAndState {
  hideMenu: () => void;
  inputNode: RefElement<HTMLInputElement>;
  inputRef: RefCallback<HTMLInputElement>;
  isMenuShown: boolean;
  onActiveItemChange: OptionHandler;
  onAdd: OptionHandler;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  onClick: MouseEventHandler<HTMLInputElement>;
  onHide: () => void;
  onInitialItemChange: (option?: Option) => void;
  onMenuItemClick: (option: Option, event: SelectEvent<HTMLElement>) => void;
  onRemove: OptionHandler;
  placeholder?: string;
  results: Option[];
  setItem: (item: Option, position: number) => void;
  toggleMenu: () => void;
}
