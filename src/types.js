// @flow

/* eslint-disable no-use-before-define */

import * as React from 'react';

export type BsSize = 'large' | 'lg' | 'small' | 'sm';
export type EventHandler = (SyntheticEvent<HTMLElement>) => void;
export type Id = number | string;
export type InputRefHandler = (HTMLInputElement | null) => void;
export type KeyDownHandler = (SyntheticKeyboardEvent<HTMLInputElement>) => void;
export type Option = string | { [string]: any };
export type OptionHandler = (Option) => void;
export type LabelKey = string | (Option) => string;
export type Style = { [string]: any };
export type ReferenceElement = HTMLElement;

export type InputProps = {
  autoComplete: string,
  className?: string,
  disabled?: boolean,
  inputClassName?: string,
  inputRef: InputRefHandler,
  onBlur: EventHandler,
  onChange: EventHandler,
  onClick: EventHandler,
  onFocus: EventHandler,
  onKeyDown: EventHandler,
  placeholder?: string,
  tabIndex: ?number,
  type: string,
  value: string,
};

export type OverlayProps = {
  align: 'justify' | 'left' | 'right',
  children: (MenuProps) => React.Node,
  dropup: boolean,
  flip: boolean,
  isMenuShown: boolean,
  positionFixed: boolean,
  referenceElement: ?ReferenceElement,
};

export type MenuProps = {
  innerRef: (HTMLElement | null) => void,
  inputHeight: number,
  scheduleUpdate: () => void,
  style: { [string]: any },
};

export type TypeaheadProps = {
  allowNew: boolean | (Option[], TypeaheadPropsAndState) => boolean,
  autoFocus: boolean,
  caseSensitive: boolean,
  children: Function,
  defaultInputValue: string,
  defaultOpen: boolean,
  defaultSelected: Option[],
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
  onMenuToggle: (boolean) => void,
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

export type TypeaheadManagerChildrenProps = {
  getInputProps: (TypeaheadProps) => InputProps,
  getOverlayProps: (TypeaheadProps) => OverlayProps,
  state: TypeaheadManagerProps,
};

export type TypeaheadManagerProps = TypeaheadPropsAndState & {
  children: (TypeaheadManagerChildrenProps) => React.Node,
  getReferenceElement: (Element | null) => void,
  inputRef: InputRefHandler,
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
