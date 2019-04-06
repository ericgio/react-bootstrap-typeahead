// @flow

export type BsSize = 'large' | 'lg' | 'small' | 'sm';

export type EventHandler = (SyntheticEvent<HTMLElement>) => void;

export type Id = number | string;

export type LabelKey = string | Function;

export type Option = string | { [string]: any };
export type OptionHandler = (Option) => void;

export type Style = { [string]: any };

export type ReferenceElement = HTMLElement;

export type InputProps = {
  autoComplete: string,
  className?: string,
  disabled?: boolean,
  inputRef: (HTMLInputElement) => void,
  onBlur: EventHandler,
  onChange: EventHandler,
  onClick: EventHandler,
  onFocus: EventHandler,
  onKeyDown: EventHandler,
  placeholder?: string,
  ref: Function,
  type: string,
  value: string,
};

export type InputMultiProps = InputProps & {
  inputClassName?: string,
  labelKey: LabelKey,
  onRemove: OptionHandler,
  selected: Option[],
};

export type MenuProps = {
  innerRef: Function,
  inputHeight: number,
  scheduleUpdate: Function,
  style: { [string]: any },
};

export type TypeaheadProps = {
  /* eslint-disable-next-line no-use-before-define */
  allowNew: boolean | (Option[], TypeaheadPropsAndState) => boolean,
  autoFocus: boolean,
  caseSensitive: boolean,
  children: Function,
  defaultInputValue: string,
  defaultOpen: boolean,
  defaultSelected: Option[],
  /* eslint-disable-next-line no-use-before-define */
  filterBy: string[] | (Option, TypeaheadPropsAndState) => void,
  highlightOnlyResult: boolean,
  id?: Id,
  ignoreDiacritics: boolean,
  labelKey: LabelKey,
  maxResults: number,
  minLength: number,
  multiple: boolean,
  onBlur: EventHandler,
  onFocus: EventHandler,
  onInputChange: (string, SyntheticEvent<HTMLInputElement>) => void,
  onKeyDown: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onPaginate: (SyntheticEvent<HTMLElement>, number) => void,
  open?: boolean,
  options: Option[],
  paginate: boolean,
  selectHintOnEnter: boolean,
};

export type TypeaheadState = {
  activeIndex: number,
  activeItem: ?Option,
  initialItem: ?Option,
  isFocused: boolean,
  selected: Option[],
  showMenu: boolean,
  shownResults: number,
  text: string,
};

export type TypeaheadPropsAndState = TypeaheadProps & TypeaheadState;

export type TypeaheadInnerProps = TypeaheadPropsAndState & {
  children: Function,
  getReferenceElement: Function,
  inputRef: (HTMLInputElement) => void,
  isMenuShown: boolean,
  onActiveItemChange: OptionHandler,
  onAdd: OptionHandler,
  onChange: (SyntheticEvent<HTMLInputElement>) => void,
  onClear: () => void,
  onInitialItemChange: (?Option) => void,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  onRemove: OptionHandler,
  placeholder?: string,
  referenceElement: ReferenceElement,
  results: Option[],
};
