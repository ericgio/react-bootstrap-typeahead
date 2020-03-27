// @flow

import isEqual from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React from 'react';

import TypeaheadManager from './TypeaheadManager';

import {
  caseSensitiveType,
  checkPropType,
  defaultInputValueType,
  defaultSelectedType,
  deprecated,
  highlightOnlyResultType,
  ignoreDiacriticsType,
  isRequiredForA11y,
  labelKeyType,
  optionType,
  selectedType,
} from '../propTypes';

import {
  addCustomOption,
  defaultFilterBy,
  getOptionLabel,
  getStringLabelKey,
  getUpdatedActiveIndex,
  getTruncatedOptions,
  head,
  isShown,
  isString,
  noop,
  uniqueId,
  validateSelectedPropChange,
} from '../utils';

import {
  DEFAULT_LABELKEY,
  DOWN,
  ESC,
  RETURN,
  TAB,
  UP,
} from '../constants';

import type {
  Option,
  TypeaheadProps,
  TypeaheadState,
} from '../types';

const propTypes = {
  /**
   * Allows the creation of new selections on the fly. Note that any new items
   * will be added to the list of selections, but not the list of original
   * options unless handled as such by `Typeahead`'s parent.
   *
   * If a function is specified, it will be used to determine whether a custom
   * option should be included. The return value should be true or false.
   */
  allowNew: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  /**
   * Autofocus the input when the component initially mounts.
   */
  autoFocus: PropTypes.bool,
  /**
   * Whether or not filtering should be case-sensitive.
   */
  caseSensitive: checkPropType(PropTypes.bool, caseSensitiveType),
  /**
   * The initial value displayed in the text input.
   */
  defaultInputValue: checkPropType(PropTypes.string, defaultInputValueType),
  /**
   * Whether or not the menu is displayed upon initial render.
   */
  defaultOpen: PropTypes.bool,
  /**
   * Specify any pre-selected options. Use only if you want the component to
   * be uncontrolled.
   */
  defaultSelected: checkPropType(
    PropTypes.arrayOf(optionType),
    defaultSelectedType
  ),
  /**
   * Either an array of fields in `option` to search, or a custom filtering
   * callback.
   */
  filterBy: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.func,
  ]),
  /**
   * Highlights the menu item if there is only one result and allows selecting
   * that item by hitting enter. Does not work with `allowNew`.
   */
  highlightOnlyResult: checkPropType(PropTypes.bool, highlightOnlyResultType),
  /**
   * An html id attribute, required for assistive technologies such as screen
   * readers.
   */
  id: checkPropType(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isRequiredForA11y,
  ),
  /**
   * Whether the filter should ignore accents and other diacritical marks.
   */
  ignoreDiacritics: checkPropType(PropTypes.bool, ignoreDiacriticsType),
  /**
   * Specify the option key to use for display or a function returning the
   * display string. By default, the selector will use the `label` key.
   */
  labelKey: checkPropType(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    labelKeyType,
  ),
  /**
   * Maximum number of results to display by default. Mostly done for
   * performance reasons so as not to render too many DOM nodes in the case of
   * large data sets.
   */
  maxResults: PropTypes.number,
  /**
   * Number of input characters that must be entered before showing results.
   */
  minLength: PropTypes.number,
  /**
   * Whether or not multiple selections are allowed.
   */
  multiple: PropTypes.bool,
  /**
   * Invoked when the input is blurred. Receives an event.
   */
  onBlur: PropTypes.func,
  /**
   * Invoked whenever items are added or removed. Receives an array of the
   * selected options.
   */
  onChange: PropTypes.func,
  /**
   * Invoked when the input is focused. Receives an event.
   */
  onFocus: PropTypes.func,
  /**
   * Invoked when the input value changes. Receives the string value of the
   * input.
   */
  onInputChange: PropTypes.func,
  /**
   * Invoked when a key is pressed. Receives an event.
   */
  onKeyDown: PropTypes.func,
  /**
   * Invoked when menu visibility changes.
   */
  onMenuToggle: PropTypes.func,
  /**
   * Invoked when the pagination menu item is clicked. Receives an event.
   */
  onPaginate: PropTypes.func,
  /**
   * Whether or not the menu should be displayed. `undefined` allows the
   * component to control visibility, while `true` and `false` show and hide
   * the menu, respectively.
   */
  open: PropTypes.bool,
  /**
   * Full set of options, including pre-selected options. Must either be an
   * array of objects (recommended) or strings.
   */
  options: PropTypes.arrayOf(optionType).isRequired,
  /**
   * Give user the ability to display additional results if the number of
   * results exceeds `maxResults`.
   */
  paginate: PropTypes.bool,
  /**
   * The selected option(s) displayed in the input. Use this prop if you want
   * to control the component via its parent.
   */
  selected: checkPropType(PropTypes.arrayOf(optionType), selectedType),
  /**
   * Allows selecting the hinted result by pressing enter.
   */
  selectHintOnEnter: deprecated(
    PropTypes.bool,
    'Use the `shouldSelect` prop on the `Hint` component to define which ' +
    'keystrokes can select the hint.'
  ),
};

const defaultProps = {
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

type Props = TypeaheadProps & {
  onChange?: (Option[]) => void,
  selected?: Option[],
};

export function getInitialState(props: Props): TypeaheadState {
  const {
    defaultInputValue,
    defaultOpen,
    defaultSelected,
    maxResults,
    multiple,
  } = props;

  let selected = props.selected ?
    props.selected.slice() :
    defaultSelected.slice();

  let text = defaultInputValue;

  if (!multiple && selected.length) {
    // Set the text if an initial selection is passed in.
    text = getOptionLabel(head(selected), props.labelKey);

    if (selected.length > 1) {
      // Limit to 1 selection in single-select mode.
      selected = selected.slice(0, 1);
    }
  }

  return {
    activeIndex: -1,
    activeItem: null,
    initialItem: null,
    isFocused: false,
    selected,
    showMenu: defaultOpen,
    shownResults: maxResults,
    text,
  };
}

export function clearTypeahead(state: TypeaheadState, props: Props) {
  return {
    ...getInitialState(props),
    isFocused: state.isFocused,
    selected: [],
    text: '',
  };
}

export function hideMenu(state: TypeaheadState, props: Props) {
  const {
    activeIndex,
    activeItem,
    initialItem,
    shownResults,
  } = getInitialState(props);

  return {
    activeIndex,
    activeItem,
    initialItem,
    showMenu: false,
    shownResults,
  };
}

export function toggleMenu(state: TypeaheadState, props: Props) {
  return state.showMenu ? hideMenu(state, props) : { showMenu: true };
}

class Typeahead extends React.Component<Props, TypeaheadState> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  state = getInitialState(this.props);

  inputNode: ?HTMLInputElement;
  isMenuShown: boolean = false;
  // Keeps track of actual items displayed in the menu, after sorting,
  // truncating, grouping, etc.
  items: Option[] = [];

  componentDidMount() {
    this.props.autoFocus && this.focus();
  }

  componentDidUpdate(prevProps: Props, prevState: TypeaheadState) {
    const { labelKey, multiple, selected } = this.props;

    validateSelectedPropChange(selected, prevProps.selected);

    // Sync selections in state with those in props.
    if (selected && !isEqual(selected, prevState.selected)) {
      this.setState({ selected });

      if (!multiple) {
        this.setState({
          text: selected.length ? getOptionLabel(head(selected), labelKey) : '',
        });
      }
    }
  }

  render() {
    // Omit `onChange` so Flow doesn't complain.
    const { onChange, ...otherProps } = this.props;
    const mergedPropsAndState = { ...otherProps, ...this.state };

    const {
      filterBy,
      labelKey,
      options,
      paginate,
      shownResults,
      text,
    } = mergedPropsAndState;

    this.isMenuShown = isShown(mergedPropsAndState);
    this.items = []; // Reset items on re-render.

    let results = [];

    if (this.isMenuShown) {
      const cb = typeof filterBy === 'function' ? filterBy : defaultFilterBy;
      results = options.filter((option: Option) => (
        cb(option, mergedPropsAndState)
      ));

      // This must come before results are truncated.
      const shouldPaginate = paginate && results.length > shownResults;

      // Truncate results if necessary.
      results = getTruncatedOptions(results, shownResults);

      // Add the custom option if necessary.
      if (addCustomOption(results, mergedPropsAndState)) {
        results.push({
          customOption: true,
          [getStringLabelKey(labelKey)]: text,
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

    return (
      <TypeaheadManager
        {...mergedPropsAndState}
        hideMenu={this.hideMenu}
        inputNode={this.inputNode}
        inputRef={this.inputRef}
        isMenuShown={this.isMenuShown}
        onActiveItemChange={this._handleActiveItemChange}
        onAdd={this._handleSelectionAdd}
        onBlur={this._handleBlur}
        onChange={this._handleInputChange}
        onClear={this._handleClear}
        onFocus={this._handleFocus}
        onHide={this.hideMenu}
        onInitialItemChange={this._handleInitialItemChange}
        onKeyDown={this._handleKeyDown}
        onMenuItemClick={this._handleMenuItemSelect}
        onRemove={this._handleSelectionRemove}
        results={results}
        setItem={this.setItem}
        toggleMenu={this.toggleMenu}
      />
    );
  }

  blur = () => {
    this.inputNode && this.inputNode.blur();
    this.hideMenu();
  }

  clear = () => {
    this.setState(clearTypeahead);
  }

  focus = () => {
    this.inputNode && this.inputNode.focus();
  }

  getInput = () => {
    return this.inputNode;
  }

  inputRef = (inputNode: ?HTMLInputElement) => {
    this.inputNode = inputNode;
  }

  setItem = (item: Option, position: number) => {
    this.items[position] = item;
  }

  hideMenu = () => {
    this.setState(hideMenu);
  }

  toggleMenu = () => {
    this.setState(toggleMenu);
  }

  _handleActiveIndexChange = (activeIndex: number) => {
    this.setState((state: TypeaheadState) => ({
      activeIndex,
      activeItem: activeIndex === -1 ? null : state.activeItem,
    }));
  }

  _handleActiveItemChange = (activeItem: Option) => {
    // Don't update the active item if it hasn't changed.
    if (!isEqual(activeItem, this.state.activeItem)) {
      this.setState({ activeItem });
    }
  }

  _handleBlur = (e: SyntheticEvent<HTMLInputElement>) => {
    e.persist();
    this.setState({ isFocused: false }, () => this.props.onBlur(e));
  }

  _handleChange = (selected: Option[]) => {
    this.props.onChange && this.props.onChange(selected);
  }

  _handleClear = () => {
    this.setState(clearTypeahead, () => this._handleChange([]));
  }

  _handleFocus = (e: SyntheticEvent<HTMLInputElement>) => {
    e.persist();
    this.setState({
      isFocused: true,
      showMenu: true,
    }, () => this.props.onFocus(e));
  }

  _handleInitialItemChange = (initialItem: ?Option) => {
    // Don't update the initial item if it hasn't changed.
    if (!isEqual(initialItem, this.state.initialItem)) {
      this.setState({ initialItem });
    }
  }

  _handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    e.persist();

    const text = e.currentTarget.value;
    const { multiple, onInputChange } = this.props;

    // Clear selections when the input value changes in single-select mode.
    const shouldClearSelections = this.state.selected.length && !multiple;

    this.setState((state, props) => {
      const { activeIndex, activeItem, shownResults } = getInitialState(props);
      return {
        activeIndex,
        activeItem,
        selected: shouldClearSelections ? [] : state.selected,
        showMenu: true,
        shownResults,
        text,
      };
    }, () => {
      onInputChange(text, e);
      shouldClearSelections && this._handleChange([]);
    });
  }

  _handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { activeItem } = this.state;

    // Skip most actions when the menu is hidden.
    if (!this.isMenuShown) {
      if (e.keyCode === UP || e.keyCode === DOWN) {
        this.setState({ showMenu: true });
      }

      this.props.onKeyDown(e);
      return;
    }

    switch (e.keyCode) {
      case UP:
      case DOWN:
        // Prevent input cursor from going to the beginning when pressing up.
        e.preventDefault();
        this._handleActiveIndexChange(getUpdatedActiveIndex(
          this.state.activeIndex,
          e.keyCode,
          this.items
        ));
        break;
      case RETURN:
        // Prevent form submission while menu is open.
        e.preventDefault();
        activeItem && this._handleMenuItemSelect(activeItem, e);
        break;
      case ESC:
      case TAB:
        // ESC simply hides the menu. TAB will blur the input and move focus to
        // the next item; hide the menu so it doesn't gain focus.
        this.hideMenu();
        break;
      default:
        break;
    }

    this.props.onKeyDown(e);
  }

  _handleMenuItemSelect = (option: Option, e: SyntheticEvent<HTMLElement>) => {
    if (option.paginationOption) {
      this._handlePaginate(e);
    } else {
      this._handleSelectionAdd(option);
    }
  }

  _handlePaginate = (e: SyntheticEvent<HTMLElement>) => {
    e.persist();

    this.setState((state, props) => ({
      shownResults: state.shownResults + props.maxResults,
    }), () => this.props.onPaginate(e, this.state.shownResults));
  }

  _handleSelectionAdd = (option: Option) => {
    const { multiple, labelKey } = this.props;

    let selected;
    let selection = option;
    let text;

    // Add a unique id to the custom selection. Avoid doing this in `render` so
    // the id doesn't increment every time.
    if (!isString(selection) && selection.customOption) {
      selection = { ...selection, id: uniqueId('new-id-') };
    }

    if (multiple) {
      // If multiple selections are allowed, add the new selection to the
      // existing selections.
      selected = this.state.selected.concat(selection);
      text = '';
    } else {
      // If only a single selection is allowed, replace the existing selection
      // with the new one.
      selected = [selection];
      text = getOptionLabel(selection, labelKey);
    }

    this.setState((state, props) => ({
      ...hideMenu(state, props),
      initialItem: selection,
      selected,
      text,
    }), () => this._handleChange(selected));
  }

  _handleSelectionRemove = (selection: Option) => {
    const selected = this.state.selected.filter((option) => (
      !isEqual(option, selection)
    ));

    // Make sure the input stays focused after the item is removed.
    this.focus();
    this.setState((state, props) => ({
      ...hideMenu(state, props),
      selected,
    }), () => this._handleChange(selected));
  }
}

export default Typeahead;
