import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  HTMLProps,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  RefCallback,
  SyntheticEvent,
} from 'react';

export type AllowNew =
  | boolean
  | ((options: Option[], state: TypeaheadPropsAndState) => boolean);
export type FilterByCallback = (
  option: Option,
  state: Omit<TypeaheadPropsAndState, 'onChange'>
) => void;
export type Id = string;
export type Option = string | Record<string, unknown>;
export type OptionHandler = (option: Option) => void;
export type LabelKey = string | ((option: Option) => string);

export type SelectEvent<T> = MouseEvent<T> | KeyboardEvent<T>;

export type RefElement<T> = T | null;

export interface InputProps {
  autoComplete: string;
  className?: string;
  disabled?: boolean;
  inputClassName?: string;
  inputRef: RefCallback<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick: MouseEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  referenceElementRef: (element: RefElement<HTMLElement>) => void;
  tabIndex?: number;
  type: string;
  value: string;
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
  children: (props: TypeaheadManagerChildProps) => JSX.Element;
  defaultInputValue: string;
  defaultOpen: boolean;
  defaultSelected: Option[];
  filterBy: string[] | FilterByCallback;
  highlightOnlyResult: boolean;
  id?: Id;
  ignoreDiacritics: boolean;
  inputProps: HTMLProps<HTMLInputElement>;
  labelKey: LabelKey;
  maxResults: number;
  minLength: number;
  multiple: boolean;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: (selected: Option[]) => void;
  onFocus: (event: SyntheticEvent<HTMLInputElement>) => void;
  onInputChange: (text: string, event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onMenuToggle: (isOpen: boolean) => void;
  onPaginate: (event: SelectEvent<HTMLElement>, shownResults: number) => void;
  open?: boolean;
  options: Option[];
  paginate: boolean;
  selected: Option[];
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
  getInputProps: (props: HTMLProps<HTMLInputElement>) => InputProps;
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

export interface TypeaheadManagerProps
  extends Omit<TypeaheadPropsAndState, 'children' | 'onChange'> {
  children: (props: TypeaheadManagerChildProps) => JSX.Element;
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
