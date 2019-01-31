import {head, isEqual, noop, uniqueId} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {RootCloseWrapper} from 'react-overlays';

import TypeaheadInner from './TypeaheadInner';
import TypeaheadInput from './TypeaheadInput';
import TypeaheadMenu from './TypeaheadMenu';

import {caseSensitiveType, checkPropType, defaultInputValueType, highlightOnlyResultType, ignoreDiacriticsType, inputPropsType, labelKeyType, optionType, selectedType} from '../propTypes';
import {addCustomOption, areEqual, defaultFilterBy, getOptionLabel, getStringLabelKey, getTruncatedOptions, isShown, warn} from '../utils';

import {DEFAULT_LABELKEY, DOWN, ESC, RETURN, RIGHT, TAB, UP} from '../constants';

function genId(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 12);
}

function maybeWarnAboutControlledSelections(prevSelected, selected) {
  const uncontrolledToControlled = !prevSelected && selected;
  const controlledToUncontrolled = prevSelected && !selected;

  let from, to, precedent;

  if (uncontrolledToControlled) {
    from = 'uncontrolled';
    to = 'controlled';
    precedent = 'an';
  } else {
    from = 'controlled';
    to = 'uncontrolled';
    precedent = 'a';
  }

  const message =
    `You are changing ${precedent} ${from} typeahead to be ${to}. ` +
    `Input elements should not switch from ${from} to ${to} (or vice versa). ` +
    'Decide between using a controlled or uncontrolled element for the ' +
    'lifetime of the component.';

  warn(
    !(uncontrolledToControlled || controlledToUncontrolled),
    message,
  );
}

function getInitialState(props) {
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

function skipDisabledOptions(results, activeIndex, keyCode) {
  let newActiveIndex = activeIndex;

  while (results[newActiveIndex] && results[newActiveIndex].disabled) {
    newActiveIndex += keyCode === UP ? -1 : 1;
  }

  return newActiveIndex;
}

class Typeahead extends React.Component {
  state = getInitialState(this.props);

  // Generate random id here since doing it in defaultProps will generate
  // the same id for every instance.
  _menuId = genId('rbt-menu-');

  static getDerivedStateFromProps(props, state) {
    const {labelKey, multiple} = props;

    // Truncate selections when in single-select mode.
    let selected = props.selected || state.selected;
    if (!multiple && selected.length > 1) {
      selected = selected.slice(0, 1);

      return {
        selected,
        text: getOptionLabel(head(selected), labelKey),
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.autoFocus && this.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const {labelKey, multiple, selected} = this.props;

    maybeWarnAboutControlledSelections(prevProps.selected, selected);

    // Keep `selected` state and props in sync. Use `componentDidUpdate`
    // rather than `getDerivedStateFromProps` to compare with previous
    // props and differentiate between externally changed selections and
    // internally changed ones that trigger `onChange` in a controlled
    // component, eg. passing an empty array vs. clearing a selection by
    // deleting part of the input value.
    if (
      isEqual(prevProps.selected, this.state.selected) &&
      !isEqual(prevProps.selected, selected)
    ) {
      // Selections were changed externally, update state accordingly.
      const text = selected.length && !multiple ?
        getOptionLabel(head(selected), labelKey) :
        '';

      this.setState({
        selected,
        text,
      });
    }

    if (prevProps.multiple !== multiple) {
      this.setState({text: ''});
    }
  }

  render() {
    const mergedPropsAndState = {...this.props, ...this.state};

    const {
      filterBy,
      labelKey,
      minLength,
      options,
      paginate,
      paginationText,
      shownResults,
      text,
    } = mergedPropsAndState;

    let results = [];

    if (text.length >= minLength) {
      const cb = Array.isArray(filterBy) ? defaultFilterBy : filterBy;
      results = options.filter((option) => (
        cb(option, mergedPropsAndState)
      ));
    }

    // This must come before results are truncated.
    const shouldPaginate = paginate && results.length > shownResults;

    // Truncate results if necessary.
    results = getTruncatedOptions(results, shownResults);

    // Add the custom option if necessary.
    if (addCustomOption(results, mergedPropsAndState)) {
      results.push({
        customOption: true,
        id: uniqueId('new-id-'),
        [getStringLabelKey(labelKey)]: text,
      });
    }

    // Add the pagination item if necessary.
    if (shouldPaginate) {
      results.push({
        [getStringLabelKey(labelKey)]: paginationText,
        paginationOption: true,
      });
    }

    // This must come after checks for the custom option and pagination.
    const isMenuShown = isShown(results, mergedPropsAndState);

    const props = {
      ...mergedPropsAndState,
      getReferenceElement: (element) => {
        // Use `findDOMNode` here because it's easier and less fragile than
        // forwarding refs to the input's container.
        /* eslint-disable-next-line react/no-find-dom-node */
        this._referenceElement = findDOMNode(element);
      },
      inputRef: (input) => this._input = input,
      isMenuShown,
      menuId: this.props.menuId || this._menuId,
      onActiveItemChange: this._handleActiveItemChange,
      onAdd: this._handleSelectionAdd,
      onBlur: this._handleBlur,
      onChange: this._handleInputChange,
      onClear: this._handleClear,
      onFocus: this._handleFocus,
      onInitialItemChange: this._handleInitialItemChange,
      onKeyDown: (e) => this._handleKeyDown(e, results, isMenuShown),
      onMenuItemClick: this._handleMenuItemSelect,
      onRemove: this._handleSelectionRemove,
      referenceElement: this._referenceElement,
      results,
    };

    return (
      <RootCloseWrapper
        disabled={this.props.open || !isMenuShown}
        onRootClose={this._hideMenu}>
        <TypeaheadInner {...props} />
      </RootCloseWrapper>
    );
  }

  blur = () => {
    this.getInput().blur();
    this._hideMenu();
  }

  clear = () => {
    this.setState((state, props) => ({
      ...getInitialState(props),
      isFocused: state.isFocused,
      selected: [],
      text: '',
    }));
  }

  focus = () => {
    this.getInput().focus();
  }

  getInput = () => {
    return this._input;
  }

  _handleActiveIndexChange = (activeIndex) => {
    const newState = {activeIndex};

    if (activeIndex === -1) {
      // Reset the active item if there is no active index.
      newState.activeItem = null;
    }

    this.setState(newState);
  }

  _handleActiveItemChange = (activeItem) => {
    // Don't update the active item if it hasn't changed.
    if (!areEqual(activeItem, this.state.activeItem, this.props.labelKey)) {
      this.setState({activeItem});
    }
  }

  _handleBlur = (e) => {
    e.persist();
    this.setState({isFocused: false}, () => this.props.onBlur(e));
  }

  _handleClear = () => {
    this.clear();
    this._updateSelected([]);
  }

  _handleFocus = (e) => {
    e.persist();
    this.setState({
      isFocused: true,
      showMenu: true,
    }, () => this.props.onFocus(e));
  }

  _handleInitialItemChange = (initialItem) => {
    // Don't update the initial item if it hasn't changed.
    if (!areEqual(initialItem, this.state.initialItem, this.props.labelKey)) {
      this.setState({initialItem});
    }
  }

  _handleInputChange = (e) => {
    e.persist();

    const text = e.target.value;
    const {
      activeIndex,
      activeItem,
      shownResults,
    } = getInitialState(this.props);
    const {multiple, onInputChange} = this.props;

    this.setState({
      activeIndex,
      activeItem,
      showMenu: true,
      shownResults,
      text,
    }, () => onInputChange(text, e));

    // Clear any selections if text is entered in single-select mode.
    if (this.state.selected.length && !multiple) {
      this._updateSelected([]);
    }
  }

  _handleKeyDown = (e, results, isMenuShown) => {
    const {activeItem} = this.state;
    let {activeIndex} = this.state;

    switch (e.keyCode) {
      case UP:
      case DOWN:
        if (!isMenuShown) {
          this._showMenu();
          break;
        }

        // Prevents input cursor from going to the beginning when pressing up.
        e.preventDefault();

        // Increment or decrement index based on user keystroke.
        activeIndex += e.keyCode === UP ? -1 : 1;

        // Skip over any disabled options.
        activeIndex = skipDisabledOptions(results, activeIndex, e.keyCode);

        // If we've reached the end, go back to the beginning or vice-versa.
        if (activeIndex === results.length) {
          activeIndex = -1;
        } else if (activeIndex === -2) {
          activeIndex = results.length - 1;

          // Skip over any disabled options.
          activeIndex = skipDisabledOptions(results, activeIndex, e.keyCode);
        }

        this._handleActiveIndexChange(activeIndex);
        break;
      case ESC:
        isMenuShown && this._hideMenu();
        break;
      case RETURN:
        if (!isMenuShown) {
          break;
        }

        // Prevent form submission while menu is open.
        e.preventDefault();
        activeItem && this._handleMenuItemSelect(activeItem, e);
        break;
      case RIGHT:
      case TAB:
        if (!isMenuShown) {
          break;
        }

        if (activeItem && !activeItem.paginationOption) {
          // Prevent blurring when selecting the active item.
          e.keyCode === TAB && e.preventDefault();
          this._handleSelectionAdd(activeItem);
          break;
        }

        if (e.keyCode === TAB) {
          this._hideMenu();
        }
        break;
      default:
        break;
    }

    this.props.onKeyDown(e);
  }

  _handleMenuItemSelect = (option, e) => {
    if (option.paginationOption) {
      this._handlePaginate(e);
    } else {
      this._handleSelectionAdd(option);
    }
  }

  _handlePaginate = (e) => {
    e.persist();

    this.setState(({shownResults}, {maxResults}) => ({
      shownResults: shownResults + maxResults,
    }), () => this.props.onPaginate(e, this.state.shownResults));
  }

  _handleSelectionAdd = (selection) => {
    const {multiple, labelKey} = this.props;

    let selected;
    let text;

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

    this._hideMenu();
    this.setState({
      initialItem: selection,
      text,
    });

    // Text must be updated before the selection to fix #211.
    // TODO: Find a more robust way of solving the issue.
    this._updateSelected(selected);
  }

  _handleSelectionRemove = (selection) => {
    const selected = this.state.selected.filter((option) => (
      !isEqual(option, selection)
    ));

    // Make sure the input stays focused after the item is removed.
    this.focus();
    this._hideMenu();
    this._updateSelected(selected);
  }

  _hideMenu = () => {
    const {
      activeIndex,
      activeItem,
      shownResults,
    } = getInitialState(this.props);

    this.setState({
      activeIndex,
      activeItem,
      showMenu: false,
      shownResults,
    });
  }

  _showMenu = () => {
    this.setState({showMenu: true});
  }

  _updateSelected = (selected) => {
    this.setState({selected}, () => {
      this.props.onChange && this.props.onChange(selected);
    });
  }
}

Typeahead.propTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: PropTypes.oneOf(['justify', 'left', 'right']),
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
   * Displays a button to clear the input when there are selections.
   */
  clearButton: PropTypes.bool,
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
  defaultSelected: optionType,
  /**
   * Whether to disable the component.
   */
  disabled: PropTypes.bool,
  /**
   * Specify whether the menu should appear above the input.
   */
  dropup: PropTypes.bool,
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel: PropTypes.node,
  /**
   * Either an array of fields in `option` to search, or a custom filtering
   * callback.
   */
  filterBy: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.func,
  ]),
  /**
   * Whether or not to automatically adjust the position of the menu when it
   * reaches the viewport boundaries.
   */
  flip: PropTypes.bool,
  /**
   * Highlights the menu item if there is only one result and allows selecting
   * that item by hitting enter. Does not work with `allowNew`.
   */
  highlightOnlyResult: checkPropType(PropTypes.bool, highlightOnlyResultType),
  /**
   * Whether the filter should ignore accents and other diacritical marks.
   */
  ignoreDiacritics: checkPropType(PropTypes.bool, ignoreDiacriticsType),
  /**
   * Props to be applied directly to the input. `onBlur`, `onChange`,
   * `onFocus`, and `onKeyDown` are ignored.
   */
  inputProps: checkPropType(PropTypes.object, inputPropsType),
  /**
   * Bootstrap 4 only. Adds the `is-invalid` classname to the `form-control`.
   */
  isInvalid: PropTypes.bool,
  /**
   * Indicate whether an asynchronous data fetch is happening.
   */
  isLoading: PropTypes.bool,
  /**
   * Bootstrap 4 only. Adds the `is-valid` classname to the `form-control`.
   */
  isValid: PropTypes.bool,
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
   * Id applied to the top-level menu element. Required for accessibility.
   */
  menuId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
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
  options: optionType.isRequired,
  /**
   * Give user the ability to display additional results if the number of
   * results exceeds `maxResults`.
   */
  paginate: PropTypes.bool,
  /**
   * Prompt displayed when large data sets are paginated.
   */
  paginationText: PropTypes.string,
  /**
   * Placeholder text for the input.
   */
  placeholder: PropTypes.string,
  /**
   * Callback for custom menu rendering.
   */
  renderMenu: PropTypes.func,
  /**
   * The selected option(s) displayed in the input. Use this prop if you want
   * to control the component via its parent.
   */
  selected: checkPropType(optionType, selectedType),
  /**
   * Allows selecting the hinted result by pressing enter.
   */
  selectHintOnEnter: PropTypes.bool,
};

Typeahead.defaultProps = {
  align: 'justify',
  allowNew: false,
  autoFocus: false,
  caseSensitive: false,
  clearButton: false,
  defaultInputValue: '',
  defaultOpen: false,
  defaultSelected: [],
  disabled: false,
  dropup: false,
  emptyLabel: 'No matches found.',
  filterBy: [],
  flip: false,
  highlightOnlyResult: false,
  ignoreDiacritics: true,
  inputProps: {},
  isInvalid: false,
  isLoading: false,
  isValid: false,
  labelKey: DEFAULT_LABELKEY,
  maxResults: 100,
  minLength: 0,
  multiple: false,
  onBlur: noop,
  onFocus: noop,
  onInputChange: noop,
  onKeyDown: noop,
  onPaginate: noop,
  paginate: true,
  paginationText: 'Display additional results...',
  placeholder: '',
  selectHintOnEnter: false,
};

Typeahead.Input = TypeaheadInput;
Typeahead.Menu = TypeaheadMenu;

export default Typeahead;
