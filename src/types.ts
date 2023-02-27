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

import { ALIGN_VALUES, SIZES } from './constants';

export type Align = typeof ALIGN_VALUES[number];

export type AllowNew<Option extends OptionType> =
  | boolean
  | ((options: Option[], state: TypeaheadPropsAndState<Option>) => boolean);

export type FilterByCallback<Option extends OptionType> = (
  option: Option,
  state: TypeaheadPropsAndState<Option>
) => boolean;

export type Id = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OptionType = string | Record<string, any>;

export type OptionHandler<Option extends OptionType> = (option: Option) => void;

export type LabelKey<Option extends OptionType> = string | ((option: Option) => string);

export type SelectEvent<T> = MouseEvent<T> | KeyboardEvent<T>;

export type SelectHint = (
  shouldSelectHint: boolean,
  event: KeyboardEvent<HTMLInputElement>
) => boolean;

export type Size = typeof SIZES[number];

export type TypeaheadChildren<Option extends OptionType> =
  | ReactNode
  | ((props: TypeaheadManagerChildProps<Option>) => ReactNode);

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface TypeaheadInputProps extends InputProps {
  inputClassName?: string;
  inputRef: RefCallback<HTMLInputElement>;
  referenceElementRef: RefCallback<HTMLElement>;
}

export interface RenderTokenProps<Option extends OptionType> {
  disabled?: boolean;
  labelKey: LabelKey<Option>;
  onRemove?: OptionHandler<Option>;
  tabIndex?: number;
}

export type RenderToken<Option extends OptionType> = (
  option: Option,
  props: RenderTokenProps<Option>,
  idx: number
) => JSX.Element;

export interface TypeaheadProps<Option extends OptionType> {
  allowNew: AllowNew<Option>;
  autoFocus: boolean;
  caseSensitive: boolean;
  children: TypeaheadChildren<Option>;
  defaultInputValue: string;
  defaultOpen: boolean;
  defaultSelected: Option[];
  emptyLabel?: ReactNode;
  filterBy: string[] | FilterByCallback<Option>;
  highlightOnlyResult: boolean;
  id?: Id;
  ignoreDiacritics: boolean;
  inputProps?: InputProps;
  labelKey: LabelKey<Option>;
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
  selectHint?: SelectHint;
}

export interface TypeaheadState<Option extends OptionType> {
  activeIndex: number;
  activeItem?: Option;
  initialItem?: Option;
  isFocused: boolean;
  selected: Option[];
  showMenu: boolean;
  shownResults: number;
  text: string;
}

export type TypeaheadPropsAndState<Option extends OptionType> = Omit<TypeaheadProps<Option>, 'onChange'> &
  TypeaheadState<Option>;

export interface TypeaheadManagerChildProps<Option extends OptionType> {
  activeIndex: number;
  getInputProps: (props?: InputProps) => TypeaheadInputProps;
  hideMenu: () => void;
  isMenuShown: boolean;
  labelKey: LabelKey<Option>;
  onClear: () => void;
  onHide: () => void;
  onRemove: OptionHandler<Option>;
  results: Option[];
  selected: Option[];
  text: string;
  toggleMenu: () => void;
}

export interface TypeaheadManagerProps<Option extends OptionType> extends TypeaheadPropsAndState<Option> {
  hideMenu: () => void;
  inputNode: HTMLInputElement | null;
  inputRef: RefCallback<HTMLInputElement>;
  isMenuShown: boolean;
  onActiveItemChange: OptionHandler<Option>;
  onAdd: OptionHandler<Option>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  onClick: MouseEventHandler<HTMLInputElement>;
  onHide: () => void;
  onInitialItemChange: (option?: Option) => void;
  onMenuItemClick: (option: Option, event: SelectEvent<HTMLElement>) => void;
  onRemove: OptionHandler<Option>;
  placeholder?: string;
  results: Option[];
  setItem: (item: Option, position: number) => void;
  toggleMenu: () => void;
}
