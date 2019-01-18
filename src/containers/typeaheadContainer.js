import {head, isEqual, noop, uniqueId} from 'lodash';
import PropTypes from 'prop-types';
import {deprecated} from 'prop-types-extra';
import React from 'react';
import {RootCloseWrapper} from 'react-overlays';

import contextContainer from './contextContainer';
import {caseSensitiveType, checkPropType, defaultInputValueType, highlightOnlyResultType, ignoreDiacriticsType, inputPropsType, labelKeyType, optionType, selectedType} from '../propTypes/';
import {addCustomOption, defaultFilterBy, getDisplayName, getOptionLabel, getStringLabelKey, getTruncatedOptions, isShown, pluralize} from '../utils/';

import {DEFAULT_LABELKEY} from '../constants/defaultLabelKey';
import {DOWN, ESC, RETURN, RIGHT, TAB, UP} from '../constants/keyCode';

function genId(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 12);
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

function typeaheadContainer(Typeahead) {
  Typeahead = contextContainer(Typeahead);

  class WrappedTypeahead extends React.Component {
    state = getInitialState(this.props);

    // Generate random id here since doing it in defaultProps will generate
    // the same id for every instance.
    _menuId = genId('rbt-menu-');

    componentDidMount() {
      this.props.autoFocus && this.focus();
    }

    componentWillReceiveProps(nextProps) {
      const {labelKey, multiple, selected} = nextProps;

      // If new selections are passed via props, treat as a controlled input.
      if (selected && !isEqual(selected, this.state.selected)) {
        this.setState({selected});

        if (multiple) {
          return;
        }

        this.setState({
          text: selected.length ? getOptionLabel(head(selected), labelKey) : '',
        });
      }

      // Truncate selections when in single-select mode.
      let newSelected = selected || this.state.selected;
      if (!multiple && newSelected.length > 1) {
        newSelected = newSelected.slice(0, 1);
        this.setState({
          selected: newSelected,
          text: getOptionLabel(head(newSelected), labelKey),
        });
        return;
      }

      if (multiple !== this.props.multiple) {
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

      return (
        <RootCloseWrapper
          disabled={this.props.open}
          onRootClose={this._handleRootClose}>
          <Typeahead
            {...mergedPropsAndState}
            inputRef={(input) => this._input = input}
            isMenuShown={isMenuShown}
            menuId={this.props.menuId || this._menuId}
            onActiveItemChange={this._handleActiveItemChange}
            onAdd={this._handleSelectionAdd}
            onBlur={this._handleBlur}
            onChange={this._handleInputChange}
            onClear={this._handleClear}
            onFocus={this._handleFocus}
            onInitialItemChange={this._handleInitialItemChange}
            onKeyDown={(e) => this._handleKeyDown(e, results, isMenuShown)}
            onMenuItemClick={this._handleMenuItemSelect}
            onRemove={this._handleSelectionRemove}
            results={results}
          />
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

    // Included for backwards-compatibility.
    getInstance = () => {
      return this;
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
      this.setState({activeItem});
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
      const {labelKey} = this.props;
      const currentItem = this.state.initialItem;

      // Don't update the initial item if it hasn't changed. For custom items,
      // compare the `labelKey` values since a unique id is generated each time,
      // causing the comparison to always return false otherwise.
      if (
        isEqual(initialItem, currentItem) ||
        (
          currentItem &&
          initialItem &&
          initialItem.customOption &&
          initialItem[labelKey] === currentItem[labelKey]
        )
      ) {
        return;
      }

      this.setState({initialItem});
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

      switch (e.keyCode) {
        case UP:
        case DOWN:
          if (!isMenuShown) {
            this._showMenu();
            break;
          }

          let {activeIndex} = this.state;

          // Prevents input cursor from going to the beginning when pressing up.
          e.preventDefault();

          // Increment or decrement index based on user keystroke.
          activeIndex += e.keyCode === UP ? -1 : 1;

          // Skip over any disabled options.
          while (results[activeIndex] && results[activeIndex].disabled) {
            activeIndex += e.keyCode === UP ? -1 : 1;
          }

          // If we've reached the end, go back to the beginning or vice-versa.
          if (activeIndex === results.length) {
            activeIndex = -1;
          } else if (activeIndex === -2) {
            activeIndex = results.length - 1;
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
      const {maxResults, onPaginate} = this.props;
      const shownResults = this.state.shownResults + maxResults;

      this.setState({shownResults}, () => onPaginate(e, shownResults));
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

    _handleRootClose = (e) => {
      this.state.showMenu && this._hideMenu();
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

  WrappedTypeahead.displayName =
    `TypeaheadContainer(${getDisplayName(Typeahead)})`;

  WrappedTypeahead.propTypes = {
    /**
     * For localized accessibility: Should return a string indicating the number
     * of results for screen readers. Receives the current results.
     */
    a11yNumResults: PropTypes.func,
    /**
     * For localized accessibility: Should return a string indicating the number
     * of selections for screen readers. Receives the current selections.
     */
    a11yNumSelected: PropTypes.func,
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
     * Whether to render the menu inline or attach to `document.body`.
     */
    bodyContainer: PropTypes.bool,
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
     * Invoked when the menu is hidden.
     */
    onMenuHide: deprecated(PropTypes.func, 'Use `onMenuToggle` instead'),
    /**
     * Invoked when the menu is shown.
     */
    onMenuShow: deprecated(PropTypes.func, 'Use `onMenuToggle` instead'),
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

  WrappedTypeahead.defaultProps = {
    a11yNumResults: (results) => {
      const resultString = pluralize('result', results.length);
      return `${resultString}. Use up and down arrow keys to navigate.`;
    },
    a11yNumSelected: (selected) => {
      return pluralize('selection', selected.length);
    },
    align: 'justify',
    allowNew: false,
    autoFocus: false,
    bodyContainer: false,
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

  return WrappedTypeahead;
}

export default typeaheadContainer;
