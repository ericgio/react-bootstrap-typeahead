// @flow

export type BsSize = 'large' | 'lg' | 'small' | 'sm';
export type EventHandler = (SyntheticEvent<HTMLElement>) => void;
export type Id = number | string;
export type InputRef = (HTMLInputElement) => void;
export type Option = string | { [string]: any };
export type OptionHandler = (Option) => void;
export type LabelKey = string | (Option) => string;
export type Style = { [string]: any };
export type ReferenceElement = HTMLElement;

export type InputProps = {
  autoComplete: string,
  className?: string,
  disabled?: boolean,
  inputRef: InputRef,
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
  onRemove: OptionHandler,
  tabIndex: ?number,
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
  onKeyDown: EventHandler,
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

export type TypeaheadManagerProps = TypeaheadPropsAndState & {
  children: Function,
  getReferenceElement: Function,
  inputRef: InputRef,
  isMenuShown: boolean,
  onActiveItemChange: OptionHandler,
  onAdd: OptionHandler,
  onChange: EventHandler,
  onClear: () => void,
  onInitialItemChange: (?Option) => void,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  onRemove: OptionHandler,
  placeholder?: string,
  referenceElement: ReferenceElement,
  results: Option[],
};
