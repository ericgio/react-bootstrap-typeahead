'use strict';

import cx from 'classnames';
import {find, isEqual, noop} from 'lodash';
import onClickOutside from 'react-onclickoutside';
import React, {PropTypes} from 'react';

import Loader from './Loader.react';
import Overlay from './Overlay.react';
import TokenizerInput from './TokenizerInput.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import addCustomOption from './utils/addCustomOption';
import defaultFilterBy from './utils/defaultFilterBy';
import getHintText from './utils/getHintText';
import getInputText from './utils/getInputText';
import getOptionLabel from './utils/getOptionLabel';
import getTruncatedOptions from './utils/getTruncatedOptions';
import warn from './utils/warn';

import {DOWN, ESC, RETURN, TAB, UP} from './utils/keyCode';

/**
 * Typeahead
 */
const Typeahead = React.createClass({
  displayName: 'Typeahead',

  propTypes: {
    /**
     * Allows the creation of new selections on the fly. Note that any new items
     * will be added to the list of selections, but not the list of original
     * options unless handled as such by `Typeahead`'s parent.
     */
    allowNew: PropTypes.bool,
    /**
     * Whether to render the menu inline or attach to `document.body`.
     */
    bodyContainer: PropTypes.bool,
    /**
     * Whether or not filtering should be case-sensitive.
     */
    caseSensitive: PropTypes.bool,
    /**
     * Specify any pre-selected options. Use only if you want the component to
     * be uncontrolled.
     */
    defaultSelected: PropTypes.array,
    /**
     * Specify whether the menu should appear above the input.
     */
    dropup: PropTypes.bool,
    /**
     * Either an array of fields in `option` to search, or a custom filtering
     * callback.
     */
    filterBy: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string.isRequired),
      PropTypes.func,
    ]),
    /**
     * Indicate whether an asynchromous data fetch is happening.
     */
    isLoading: PropTypes.bool,
    /**
     * Specify the option key to use for display or a function returning the
     * display string. By default, the selector will use the `label` key.
     */
    labelKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
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
     * Callback fired when the input is blurred. Receives an event.
     */
    onBlur: PropTypes.func,
    /**
     * Callback fired whenever items are added or removed. Receives an array of
     * the selected options.
     */
    onChange: PropTypes.func,
    /**
     * Callback fired when the input is focused. Receives an event.
     */
    onFocus: PropTypes.func,
    /**
     * Callback for handling changes to the user-input text.
     */
    onInputChange: PropTypes.func,
    /**
     * Full set of options, including pre-selected options. Must either be an
     * array of objects (recommended) or strings.
     */
    options: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object.isRequired),
      PropTypes.arrayOf(PropTypes.string.isRequired),
    ]).isRequired,
    /**
     * Give user the ability to display additional results if the number of
     * results exceeds `maxResults`.
     */
    paginate: PropTypes.bool,
    /**
     * Callback for custom menu rendering.
     */
    renderMenu: PropTypes.func,
    /**
     * The selected option(s) displayed in the input. Use this prop if you want
     * to control the component via its parent.
     */
    selected: PropTypes.array,
  },

  getDefaultProps() {
    return {
      allowNew: false,
      caseSensitive: false,
      defaultSelected: [],
      dropup: false,
      filterBy: [],
      isLoading: false,
      labelKey: 'label',
      maxResults: 100,
      onBlur: noop,
      onChange: noop,
      onFocus: noop,
      onInputChange: noop,
      minLength: 0,
      multiple: false,
      paginate: true,
      selected: [],
    };
  },

  childContextTypes: {
    activeIndex: PropTypes.number.isRequired,
    onActiveItemChange: PropTypes.func.isRequired,
    onInitialItemChange: PropTypes.func.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
  },

  getChildContext() {
    return {
      activeIndex: this.state.activeIndex,
      onActiveItemChange: activeItem => this.setState({activeItem}),
      onInitialItemChange: initialItem => this.setState({initialItem}),
      onMenuItemClick: this._handleAddOption,
    };
  },

  getInitialState() {
    const {defaultSelected, maxResults} = this.props;

    let selected = this.props.selected.slice();
    if (defaultSelected && defaultSelected.length) {
      selected = defaultSelected;
    }

    return {
      activeIndex: -1,
      activeItem: null,
      initialItem: null,
      selected,
      showMenu: false,
      shownResults: maxResults,
      text: '',
    };
  },

  componentWillMount() {
    const {allowNew, caseSensitive, filterBy, labelKey} = this.props;

    warn(
      !(typeof filterBy === 'function' && caseSensitive),
      'Because you have defined a `filterBy` callback, the `caseSensitive` ' +
      'prop will be ignored.'
    );

    warn(
      !(typeof labelKey === 'function' && allowNew),
      '`labelKey` must be a string if creating new options is allowed.'
    );
  },

  componentWillReceiveProps(nextProps) {
    const {multiple, selected} = nextProps;

    if (!isEqual(selected, this.props.selected)) {
      // If new selections are passed in via props, treat the component as a
      // controlled input.
      this.setState({selected});
    }

    if (multiple !== this.props.multiple) {
      this.setState({text: ''});
    }
  },

  render() {
    const {allowNew, className, dropup, labelKey, paginate} = this.props;
    const {shownResults, text} = this.state;

    // First filter the results by the input string.
    let results = this._getFilteredResults();

    // This must come before we truncate.
    const shouldPaginate = paginate && results.length > shownResults;

    // Truncate if necessary.
    results = getTruncatedOptions(results, shownResults);

    // Add the custom option.
    if (allowNew) {
      results = addCustomOption(results, text, labelKey);
    }

    return (
      <div
        className={cx('bootstrap-typeahead', 'open', {
          'dropup': dropup,
        }, className)}
        style={{position: 'relative'}}>
        {this._renderInput(results)}
        {this._renderLoader()}
        {this._renderMenu(results, shouldPaginate)}
      </div>
    );
  },

  _getFilteredResults() {
    const {caseSensitive, labelKey, minLength, multiple, options} = this.props;
    const {selected, text} = this.state;

    if (text.length < minLength) {
      return [];
    }

    let {filterBy} = this.props;
    if (Array.isArray(filterBy)) {
      const fields = filterBy;
      filterBy = option => defaultFilterBy(
        option,
        labelKey,
        multiple && !!find(selected, o => isEqual(o, option)),
        text,
        {caseSensitive, fields}
      );
    }

    return options.filter(filterBy);
  },

  blur() {
    this.refs.input.blur();
  },

  /**
   * Public method to allow external clearing of the input. Clears both text
   * and selection(s).
   */
  clear() {
    const {activeIndex, activeItem, showMenu} = this.getInitialState();
    const selected = [];
    const text = '';

    this.setState({
      activeIndex,
      activeItem,
      selected,
      showMenu,
      text,
    });

    this.props.onChange(selected);
    this.props.onInputChange(text);
  },

  focus() {
    this.refs.input.focus();
  },

  _renderInput(results) {
    const {
      bsSize,
      disabled,
      isLoading,
      labelKey,
      multiple,
      name,
      placeholder,
      renderToken,
    } = this.props;
    const {activeIndex, activeItem, initialItem, selected, text} = this.state;
    const Input = multiple ? TokenizerInput : TypeaheadInput;
    const inputProps = {bsSize, disabled, name, placeholder, renderToken};

    return (
      <Input
        {...inputProps}
        activeIndex={activeIndex}
        activeItem={activeItem}
        hasAux={isLoading}
        hintText={getHintText({
          activeItem,
          initialItem,
          labelKey,
          selected,
          text,
        })}
        initialItem={initialItem}
        labelKey={labelKey}
        onAdd={this._handleAddOption}
        onBlur={this._handleBlur}
        onChange={this._handleTextChange}
        onFocus={this._handleFocus}
        onKeyDown={e => this._handleKeydown(results, e)}
        onRemove={this._handleRemoveOption}
        options={results}
        ref="input"
        selected={selected.slice()}
        value={getInputText({activeItem, labelKey, multiple, selected, text})}
      />
    );
  },

  _renderMenu(results, shouldPaginate) {
    const {
      align,
      bodyContainer,
      dropup,
      emptyLabel,
      labelKey,
      maxHeight,
      minLength,
      newSelectionPrefix,
      paginationText,
      renderMenu,
      renderMenuItemChildren,
    } = this.props;

    const {showMenu, text} = this.state;

    const menuProps = {
      align,
      dropup,
      emptyLabel,
      labelKey,
      maxHeight,
      newSelectionPrefix,
      paginationText,
      onPaginate: this._handlePagination,
      paginate: shouldPaginate,
      text,
    };

    const menu = renderMenu ?
      renderMenu(results, menuProps) :
      <TypeaheadMenu
        {...menuProps}
        options={results}
        renderMenuItemChildren={renderMenuItemChildren}
      />;

    return (
      <Overlay
        container={bodyContainer ? document.body : this}
        show={showMenu && text.length >= minLength}
        target={() => this.refs.input}>
        {menu}
      </Overlay>
    );
  },

  _renderLoader() {
    if (this.props.isLoading) {
      return <Loader bsSize={this.props.bsSize} />;
    }
  },

  _handleBlur(e) {
    // Note: Don't hide the menu here, since that interferes with other actions
    // like making a selection by clicking on a menu item.
    this.props.onBlur(e);
  },

  _handleFocus(e) {
    this.props.onFocus(e);
    this.setState({showMenu: true});
  },

  _handleTextChange(text) {
    const {activeIndex, activeItem} = this.getInitialState();
    this.setState({
      activeIndex,
      activeItem,
      showMenu: true,
      text,
    });

    this.props.onInputChange(text);
  },

  _handleKeydown(options, e) {
    const {activeItem, showMenu} = this.state;

    switch (e.keyCode) {
      case UP:
      case DOWN:
        // Don't cycle through the options if the menu is hidden.
        if (!showMenu) {
          return;
        }

        let {activeIndex} = this.state;

        // Prevents input cursor from going to the beginning when pressing up.
        e.preventDefault();

        // Increment or decrement index based on user keystroke.
        activeIndex += e.keyCode === UP ? -1 : 1;

        // If we've reached the end, go back to the beginning or vice-versa.
        if (activeIndex === options.length) {
          activeIndex = -1;
        } else if (activeIndex === -2) {
          activeIndex = options.length - 1;
        }

        const newState = {activeIndex};
        if (activeIndex === -1) {
          // Reset the active item if there is no active index.
          newState.activeItem = null;
        }

        this.setState(newState);
        break;
      case ESC:
      case TAB:
        // Prevent closing dialogs.
        e.keyCode === ESC && e.preventDefault();

        this._hideDropdown();
        break;
      case RETURN:
        // Prevent submitting forms.
        e.preventDefault();

        if (showMenu) {
          activeItem && this._handleAddOption(activeItem);
        }
        break;
    }
  },

  _handleAddOption(selectedOption) {
    const {multiple, labelKey, onChange, onInputChange} = this.props;

    let selected;
    let text;

    if (multiple) {
      // If multiple selections are allowed, add the new selection to the
      // existing selections.
      selected = this.state.selected.concat(selectedOption);
      text = '';
    } else {
      // If only a single selection is allowed, replace the existing selection
      // with the new one.
      selected = [selectedOption];
      text = getOptionLabel(selectedOption, labelKey);
    }

    this.setState({
      initialItem: selectedOption,
      selected,
      text,
    });
    this._hideDropdown();

    onChange(selected);
    onInputChange(text);
  },

  _handlePagination(e) {
    let shownResults = this.state.shownResults + this.props.maxResults;

    // Keep the input focused when paginating.
    this.focus();

    this.setState({shownResults});
  },

  _handleRemoveOption(removedOption) {
    let selected = this.state.selected.slice();
    selected = selected.filter(option => !isEqual(option, removedOption));

    // Make sure the input stays focused after the item is removed.
    this.focus();

    this.setState({selected});
    this._hideDropdown();

    this.props.onChange(selected);
  },

  /**
   * From `onClickOutside` HOC.
   */
  handleClickOutside(e) {
    this._hideDropdown();
  },

  _hideDropdown() {
    const {
      activeIndex,
      activeItem,
      showMenu,
      shownResults,
    } = this.getInitialState();

    this.setState({
      activeIndex,
      activeItem,
      showMenu,
      shownResults,
    });
  },
});

export default onClickOutside(Typeahead);
