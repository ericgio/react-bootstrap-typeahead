// @flow

export type LabelKey = string | Function;
export type Option = string | {
  [string]: any,
};

export type TypeaheadProps = {
  align: 'justify' | 'left' | 'right',
  allowNew: boolean | Function,
  autoFocus: boolean,
  caseSensitive: boolean,
  defaultInputValue: string,
  defaultOpen: boolean,
  defaultSelected: Option[],
  disabled: boolean,
  dropup: boolean,
  filterBy: string[] | Function,
  flip: boolean,
  highlightOnlyResult: boolean,
  id: number | string,
  ignoreDiacritics: boolean,
  inputProps: Object,
  labelKey: LabelKey,
  maxResults: number,
  minLength: number,
  multiple: boolean,
  onBlur: Function,
  onChange?: Function,
  onFocus: Function,
  onInputChange: Function,
  onKeyDown: Function,
  onMenuToggle?: Function,
  onPaginate: Function,
  open?: boolean,
  options: Option[],
  paginate: boolean,
  paginationText: string,
  placeholder: string,
  selected?: Option[],
  selectHintOnEnter: boolean,
};

export type TypeaheadState = {
  activeIndex: number,
  activeItem?: Option,
  initialItem?: Option,
  isFocused: boolean,
  selected: Option[],
  showMenu: boolean,
  shownResults: number,
  text: string,
};
