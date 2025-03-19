import isEqual from 'fast-deep-equal';
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import usePrevious from '@restart/hooks/usePrevious';

import {
  clearTypeahead,
  clickOrFocusInput,
  getInitialState,
  hideMenu as _hideMenu,
  toggleMenu as _toggleMenu,
  useTypeaheadState,
} from './TypeaheadState';

import {
  FilterByCallback,
  Option,
  SelectEvent,
  TypeaheadProps,
} from '../types';

import {
  addCustomOption,
  defaultFilterBy,
  getOptionLabel,
  getOptionProperty,
  getStringLabelKey,
  getTruncatedOptions,
  getUpdatedActiveIndex,
  isFunction,
  isShown,
  isString,
  noop,
  uniqueId,
  validateSelectedPropChange,
} from '../utils';

import { DEFAULT_LABELKEY } from '../constants';

export const defaultProps = {
  allowNew: false,
  autoFocus: false,
  caseSensitive: false,
  defaultInputValue: '',
  defaultOpen: false,
  defaultSelected: [],
  filterBy: [],
  highlightOnlyResult: false,
  ignoreDiacritics: true,
  labelKey: DEFAULT_LABELKEY,
  maxResults: 100,
  minLength: 0,
  multiple: false,
  onBlur: noop,
  onFocus: noop,
  onInputChange: noop,
  onKeyDown: noop,
  onMenuToggle: noop,
  onPaginate: noop,
  paginate: true,
};

/**
 * Manually trigger the input's change event.
 * https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js/46012210#46012210
 */
function triggerInputChange(input: HTMLInputElement, value: string) {
  const inputValue = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  );

  inputValue && inputValue.set && inputValue.set.call(input, value);
  const e = new Event('input', { bubbles: true });
  input.dispatchEvent(e);
}

export interface TypeaheadRef {
  blur: () => void;
  clear: () => void;
  focus: () => void;
  getInput: () => void;
  hideMenu: () => void;
  toggleMenu: () => void;
}

interface Props extends Partial<TypeaheadProps> {
  options: Option[];
}

type InternalProps = Omit<TypeaheadProps, 'onChange'>;

function useTypeahead(
  { onChange, ...partialProps }: Props,
  ref: Ref<TypeaheadRef>
) {
  const props: InternalProps = {
    ...defaultProps,
    ...partialProps,
  };

  const [state, setState] = useTypeaheadState(props);
  const [inputNode, setInputNode] = useState<HTMLInputElement | null>(null);

  const mergedPropsAndState = { ...props, ...state };
  const { filterBy, labelKey, options, paginate } = mergedPropsAndState;

  const isMenuShown = isShown(mergedPropsAndState);
  const items: Option[] = [];

  // Imperative methods
  function hideMenu() {
    setState(_hideMenu);
  }

  function blur() {
    inputNode?.blur();
    hideMenu();
  }

  function clear() {
    setState(clearTypeahead);
  }

  const focus = useCallback(() => {
    inputNode?.focus();
  }, [inputNode]);

  function getInput() {
    return inputNode;
  }

  function toggleMenu() {
    setState(_toggleMenu);
  }

  useImperativeHandle(ref, () => ({
    blur,
    clear,
    focus,
    getInput,
    hideMenu,
    toggleMenu,
  }));

  useEffect(() => {
    props.autoFocus && focus();
  }, [props.autoFocus, focus]);

  const prevProps = usePrevious(props);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    validateSelectedPropChange(props.selected, prevProps?.selected);

    // Sync selections in state with those in props.
    if (props.selected && !isEqual(props.selected, state.selected)) {
      setState({ selected: props.selected });

      if (!props.multiple) {
        setState({
          text: props.selected.length
            ? getOptionLabel(props.selected[0], props.labelKey)
            : '',
        });
      }
    }
  }, [
    props.labelKey,
    props.multiple,
    props.selected,
    prevProps?.selected,
    setState,
    state.selected,
  ]);

  function setItem(item: Option, position: number) {
    items[position] = item;
  }

  function onActiveIndexChange(index: number) {
    setState((currentState) => ({
      activeIndex: index,
      activeItem: index >= 0 ? currentState.activeItem : undefined,
    }));
  }

  function onActiveItemChange(activeItem: Option) {
    // Don't update the active item if it hasn't changed.
    if (!isEqual(activeItem, state.activeItem)) {
      setState({ activeItem });
    }
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    setState({ isFocused: false }, () => props.onBlur(e));
  }

  function onSelect(newSelected: Option[]) {
    onChange && onChange(newSelected);
  }

  function onClear() {
    inputNode && triggerInputChange(inputNode, '');
    setState(clearTypeahead, () => {
      // Change handler is automatically triggered for single selections but
      // not multi-selections.
      if (props.multiple) {
        onSelect([]);
      }
    });
  }

  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    const handleClick = props.inputProps?.onClick;

    setState(clickOrFocusInput, () => handleClick && handleClick(e));
  }

  function onFocus(e: React.SyntheticEvent<HTMLInputElement>) {
    setState(clickOrFocusInput, () => props.onFocus(e));
  }

  function onInitialItemChange(initialItem?: Option) {
    // Don't update the initial item if it hasn't changed.
    if (!isEqual(initialItem, state.initialItem)) {
      setState({ initialItem });
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;

    // Clear selections when the input value changes in single-select mode.
    const shouldClearSelections = state.selected.length && !props.multiple;
    const { activeIndex, activeItem, shownResults } = getInitialState(props);

    setState({
      activeIndex,
      activeItem,
      selected: shouldClearSelections ? [] : state.selected,
      showMenu: true,
      shownResults,
      text: value,
    });

    props.onInputChange(value, e);
    shouldClearSelections && onSelect([]);
  }

  function onAdd(option: Option) {
    let selected: Option[];
    let selection = option;
    let text = '';

    // Add a unique id to the custom selection. Avoid doing this in `render` so
    // the id doesn't increment every time.
    if (!isString(selection) && selection.customOption) {
      selection = { ...selection, id: uniqueId('new-id-') };
    }

    if (props.multiple) {
      // If multiple selections are allowed, add the new selection to the
      // existing selections.
      selected = [...state.selected, selection];
    } else {
      // If only a single selection is allowed, replace the existing selection
      // with the new one.
      selected = [selection];
      text = getOptionLabel(selection, props.labelKey);
    }

    setState(
      {
        ..._hideMenu(state, props),
        initialItem: selection,
        selected,
        text,
      },
      (newState) => onSelect(newState.selected)
    );
  }

  function onPaginate(e: SelectEvent<HTMLElement>) {
    setState(
      (currentState) => ({
        shownResults: currentState.shownResults + props.maxResults,
      }),
      (newState) => props.onPaginate(e, newState.shownResults)
    );
  }

  function onMenuItemSelect(option: Option, e: SelectEvent<HTMLElement>) {
    if (getOptionProperty(option, 'paginationOption')) {
      onPaginate(e);
    } else {
      onAdd(option);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Skip most actions when the menu is hidden.
    if (!isMenuShown) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setState({ showMenu: true });
      }

      props.onKeyDown(e);
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        // Prevent input cursor from going to the beginning when pressing up.
        e.preventDefault();
        onActiveIndexChange(
          getUpdatedActiveIndex(state.activeIndex, e.key, items)
        );
        break;
      case 'Enter':
        // Prevent form submission while menu is open.
        e.preventDefault();
        state.activeItem && onMenuItemSelect(state.activeItem, e);
        break;
      case 'Escape':
      case 'Tab':
        // ESC simply hides the menu. TAB will blur the input and move focus to
        // the next item; hide the menu so it doesn't gain focus.
        hideMenu();
        break;
      default:
        break;
    }

    props.onKeyDown(e);
  }

  function onRemove(selection: Option) {
    const selected = state.selected.filter(
      (option) => !isEqual(option, selection)
    );

    // Make sure the input stays focused after the item is removed.
    focus();
    setState(
      {
        ..._hideMenu(state, props),
        selected,
      },
      () => onSelect(selected)
    );
  }

  let results: Option[] = [];

  if (isMenuShown) {
    const cb = (
      isFunction(filterBy) ? filterBy : defaultFilterBy
    ) as FilterByCallback;

    results = options.filter((option: Option) =>
      cb(option, mergedPropsAndState)
    );

    // This must come before results are truncated.
    const shouldPaginate = paginate && results.length > state.shownResults;

    // Truncate results if necessary.
    results = getTruncatedOptions(results, state.shownResults);

    // Add the custom option if necessary.
    if (addCustomOption(results, mergedPropsAndState)) {
      results.push({
        customOption: true,
        [getStringLabelKey(labelKey)]: state.text,
      });
    }

    // Add the pagination item if necessary.
    if (shouldPaginate) {
      results.push({
        [getStringLabelKey(labelKey)]: '',
        paginationOption: true,
      });
    }
  }

  return {
    ...mergedPropsAndState,
    hideMenu,
    inputNode,
    inputRef: setInputNode,
    isMenuShown,
    onActiveItemChange,
    onAdd,
    onBlur,
    onChange: onInputChange,
    onClear,
    onClick,
    onFocus,
    onHide: hideMenu,
    onInitialItemChange,
    onKeyDown,
    onMenuItemClick: onMenuItemSelect,
    onRemove,
    results,
    setItem,
    toggleMenu,
  };
}

export default useTypeahead;
