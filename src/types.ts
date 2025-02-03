import {
  ChangeEvent,
  FocusEventHandler,
  InputHTMLAttributes,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  ReactNode,
  RefCallback,
} from 'react';

import { ALIGN_VALUES, SIZES } from './constants';

export type Align = (typeof ALIGN_VALUES)[number];

export type AllowNew =
  | boolean
  | ((options: Option[], state: TypeaheadPropsAndState) => boolean);

export type FilterByCallback = (
  option: Option,
  state: TypeaheadPropsAndState
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

export type TypeaheadChildren =
  | ReactNode
  | ((props: TypeaheadChildProps) => ReactNode);

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

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
  /**
   * Allows the creation of new selections on the fly. Note that any new items
   * will be added to the list of selections, but not the list of original
   * options unless handled as such by `Typeahead`'s parent.
   *
   * If a function is specified, it will be used to determine whether a custom
   * option should be included. The return value should be true or false.
   */
  allowNew?: AllowNew;
  /**
   * Autofocus the input when the component initially mounts.
   */
  autoFocus?: boolean;
  /**
   * Whether or not filtering should be case-sensitive.
   */
  caseSensitive?: boolean;
  /**
   * The initial value displayed in the text input.
   */
  defaultInputValue?: string;
  /**
   * Whether or not the menu is displayed upon initial render.
   */
  defaultOpen?: boolean;
  /**
   * Specify any pre-selected options. Use only if you want the component to
   * be uncontrolled.
   */
  defaultSelected?: Option[];
  /**
   * Either an array of fields in `option` to search, or a custom filtering
   * callback.
   */
  filterBy?: string[] | FilterByCallback;
  /**
   * Highlights the menu item if there is only one result and allows selecting
   * that item by hitting enter. Does not work with `allowNew`.
   */
  highlightOnlyResult?: boolean;
  /**
   * An html id attribute, required for assistive technologies such as screen
   * readers.
   */
  id?: Id;
  /**
   * Whether the filter should ignore accents and other diacritical marks.
   */
  ignoreDiacritics?: boolean;
  inputProps?: InputProps;
  /**
   * Specify the option key to use for display or a function returning the
   * display string. By default, the selector will use the `label` key.
   */
  labelKey?: LabelKey;
  /**
   * Number of input characters that must be entered before showing results.
   */
  minLength?: number;
  /**
   * Whether or not multiple selections are allowed.
   */
  multiple?: boolean;
  /**
   * Invoked when the input is blurred. Receives an event.
   */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /**
   * Invoked whenever items are added or removed. Receives an array of the
   * selected options.
   */
  onChange?: (selected: Option[]) => void;
  /**
   * Invoked when the input is focused. Receives an event.
   */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /**
   * Invoked when the input value changes. Receives the string value of the
   * input.
   */
  onInputChange?: (text: string, event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Invoked when a key is pressed. Receives an event.
   */
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  /**
   * Invoked when menu visibility changes.
   */
  onMenuToggle?: (isOpen: boolean) => void;

  /**
   * Whether or not the menu should be displayed. `undefined` allows the
   * component to control visibility, while `true` and `false` show and hide
   * the menu, respectively.
   */
  open?: boolean;
  /**
   * Full set of options, including pre-selected options. Must either be an
   * array of objects (recommended) or strings.
   */
  options: Option[];
  /**
   * The selected option(s) displayed in the input. Use this prop if you want
   * to control the component via its parent.
   */
  selected?: Option[];
  selectHint?: SelectHint;
}

type OptionalProps<T, K extends keyof T> = Partial<Pick<T, K>> &
  Required<Omit<T, K>>;

/**
 * Most props used internally become "required" since they're given default
 * values.
 */
export type InternalProps = OptionalProps<
  Required<Omit<TypeaheadProps, 'onChange'>>,
  'id' | 'open' | 'selected' | 'selectHint'
>;

export interface TypeaheadState {
  activeIndex: number;
  activeItem?: Option;
  initialItem?: Option;
  isFocused: boolean;
  selected: Option[];
  showMenu: boolean;
  text: string;
}

export type TypeaheadPropsAndState = InternalProps & TypeaheadState;

export interface TypeaheadChildProps {
  getInputProps: (
    props?: InputProps
  ) => Omit<TypeaheadInputProps, 'referenceElementRef'>;
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
