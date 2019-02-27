// @flow

export type Align = 'justify' | 'left' | 'right';

export type LabelKey = string | Function;

export type Option = string | {
  [string]: any,
};

export type ReferenceElement = null | Element | Text;

export type TypeaheadProps = {
  align: Align,
  /* eslint-disable-next-line no-use-before-define */
  allowNew: boolean | (Option[], TypeaheadMergedProps) => boolean,
  autoFocus: boolean,
  caseSensitive: boolean,
  children: Function,
  defaultInputValue: string,
  defaultOpen: boolean,
  defaultSelected: Option[],
  disabled: boolean,
  dropup: boolean,
  /* eslint-disable-next-line no-use-before-define */
  filterBy: string[] | (Option, TypeaheadMergedProps) => void,
  flip: boolean,
  highlightOnlyResult: boolean,
  id: number | string,
  ignoreDiacritics: boolean,
  inputProps: Object,
  labelKey: LabelKey,
  maxResults: number,
  minLength: number,
  multiple: boolean,
  onBlur: (SyntheticEvent<HTMLElement>) => void,
  onFocus: (SyntheticEvent<HTMLElement>) => void,
  onInputChange: (string, SyntheticEvent<HTMLInputElement>) => void,
  onKeyDown: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onMenuToggle?: (boolean) => void,
  onPaginate: (SyntheticEvent<HTMLElement>, number) => void,
  open?: boolean,
  options: Option[],
  paginate: boolean,
  paginationText: string,
  placeholder: string,
  positionFixed: boolean,
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

export type TypeaheadMergedProps = TypeaheadProps & TypeaheadState;

export type TypeaheadInnerProps = TypeaheadMergedProps & {
  children: Function,
  getReferenceElement: Function,
  inputRef: (HTMLInputElement) => void,
  isMenuShown: boolean,
  onActiveItemChange: (Option) => void,
  onAdd: (Option) => void,
  onChange: (SyntheticEvent<HTMLInputElement>) => void,
  onClear: () => void,
  onInitialItemChange: Function,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  onRemove: (Option) => void,
  referenceElement: ReferenceElement,
  results: Option[],
};
