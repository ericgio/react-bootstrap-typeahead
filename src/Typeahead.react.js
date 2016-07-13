'use strict';

import React, {PropTypes} from 'react';

import TokenizerInput from './TokenizerInput.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import {find, head, isEmpty, isEqual, uniqueId} from 'lodash';
import {BACKSPACE, DOWN, ESC, RETURN, TAB, UP} from './keyCode';
import listensToClickOutside from 'react-onclickoutside/decorator';

/**
 * Typeahead
 */
const Typeahead = React.createClass({
  displayName: 'Typeahead',

  propTypes: {
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
     */
    allowNew: PropTypes.bool,
    /**
     * Specify any pre-selected options. Use only if you want the component to
     * be uncontrolled.
     */
    defaultSelected: PropTypes.array,
    /**
     * Whether to disable the input. Will also disable selections when
     * `multiple={true}`.
     */
    disabled: PropTypes.bool,
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: PropTypes.string,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: PropTypes.string,
    /**
     * Maximum height of the dropdown menu, in px.
     */
    maxHeight: PropTypes.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: PropTypes.bool,
    /**
     * Provides the ability to specify a prefix before the user-entered text to
     * indicate that the selection will be new. No-op unless `allowNew={true}`.
     */
    newSelectionPrefix: PropTypes.string,
    onBlur: PropTypes.func,
    /**
     * Callback for handling selected values.
     */
    onChange: PropTypes.func,
    /**
     * Callback for handling changes to the user-input text.
     */
    onInputChange: PropTypes.func,
    /**
     * Full set of options, including pre-selected options.
     */
    options: PropTypes.array.isRequired,
    /**
     * For large option sets, initially display a subset of results for improved
     * performance. If users scroll to the end, the last item will be a link to
     * display the next set of results. Value represents the number of results
     * to display. `0` will display all results.
     */
    paginateResults: PropTypes.number,
    /**
     * Placeholder text for the input.
     */
    placeholder: PropTypes.string,
    /**
     * Provides a hook for customized rendering of menu item contents.
     */
    renderMenuItemChildren: PropTypes.func,
    /**
     * Provides a hook for rendering a header for the menu.
     */
    renderMenuHeader: PropTypes.func,
    /**
     * The selected option(s) displayed in the input. Use this prop if you want
     * to control the component via its parent.
     */
    selected: PropTypes.array,
  },

  getDefaultProps() {
    return {
      allowNew: false,
      defaultSelected: [],
      labelKey: 'label',
      multiple: false,
      selected: [],
    };
  },

  getInitialState() {
    const {defaultSelected, labelKey, multiple} = this.props;

    let selected = this.props.selected.slice();
    if (!isEmpty(defaultSelected)) {
      selected = defaultSelected;
    }

    let selectedText = !isEmpty(selected) && head(selected)[labelKey];
    let text = '';
    if (!multiple && selectedText) {
      text = selectedText;
    }

    return {
      activeIndex: 0,
      selected,
      showMenu: false,
      text,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.selected, nextProps.selected)) {
      // If new selections are passed in via props, treat the component as a
      // controlled input.
      this.setState({selected: nextProps.selected});
    }

    if (this.props.multiple !== nextProps.multiple) {
      this.setState({text: ''});
    }
  },

  render() {
    const {allowNew, labelKey, multiple, options} = this.props;
    const {activeIndex, selected, showMenu, text} = this.state;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.
    let filteredOptions = options.filter((option) => {
      let labelString = option[labelKey];

      if (!labelString || typeof labelString !== 'string') {
        throw new Error(
          'One or more options does not have a valid label string. Please ' +
          'check the `labelKey` prop to ensure that it matches the correct ' +
          'option key and provides a string for filtering and display.'
        );
      }

      return !(
        labelString.toLowerCase().indexOf(text.toLowerCase()) === -1 ||
        multiple && find(selected, option)
      );
    });

    if (!filteredOptions.length && allowNew && !!text.trim()) {
      let newOption = {
        id: uniqueId('new-id-'),
        customOption: true,
      };
      newOption[labelKey] = text;
      filteredOptions = [newOption];
    }

    let InputComponent = TokenizerInput;
    let inputText = text;
    let selectedItems = selected.slice();

    if (!multiple) {
      InputComponent = TypeaheadInput;
      selectedItems = head(selectedItems);
      inputText = (selectedItems && selectedItems[labelKey]) || text;
    }

    let menu;
    if (showMenu) {
      menu =
        <TypeaheadMenu
          activeIndex={activeIndex}
          align={this.props.align}
          emptyLabel={this.props.emptyLabel}
          initialResultCount={this.props.paginateResults}
          labelKey={labelKey}
          maxHeight={this.props.maxHeight}
          newSelectionPrefix={this.props.newSelectionPrefix}
          onClick={this._handleAddOption}
          options={filteredOptions}
          renderMenuHeader={this.props.renderMenuHeader}
          renderMenuItemChildren={this.props.renderMenuItemChildren}
          text={inputText}
        />;
    }

    return (
      <div
        className="bootstrap-typeahead open"
        style={{position: 'relative'}}>
        <InputComponent
          disabled={this.props.disabled}
          filteredOptions={filteredOptions}
          labelKey={labelKey}
          onAdd={this._handleAddOption}
          onBlur={this.props.onBlur}
          onChange={this._handleTextChange}
          onFocus={this._handleFocus}
          onKeyDown={this._handleKeydown.bind(null, filteredOptions)}
          onRemove={this._handleRemoveOption}
          placeholder={this.props.placeholder}
          selected={selectedItems}
          text={inputText}
        />
        {menu}
      </div>
    );
  },

  _handleFocus() {
    this.setState({showMenu: true});
  },

  _handleTextChange(e) {
    let text = e.target.value;

    // Clear any selections when text is entered.
    const {selected} = this.state;
    if (!this.props.multiple && !isEmpty(selected)) {
      this._handleRemoveOption(head(selected));
    }

    this.setState({
      activeIndex: 0,
      showMenu: true,
      text,
    });

    this.props.onInputChange && this.props.onInputChange(text);
  },

  _handleKeydown(options, e) {
    let {activeIndex} = this.state;

    switch (e.keyCode) {
      case BACKSPACE:
        // Don't let the browser go back.
        e.stopPropagation();
        break;
      case UP:
      case DOWN:
        // Prevent page from scrolling.
        e.preventDefault();

        // Increment or decrement index based on user keystroke.
        activeIndex += e.keyCode === UP ? -1 : 1;

        // If we've reached the end, go back to the beginning or vice-versa.
        activeIndex = (activeIndex + options.length) % options.length;

        this.setState({activeIndex});
        break;
      case ESC:
      case TAB:
        // Prevent things like unintentionally closing dialogs.
        e.stopPropagation();
        this._hideDropdown();
        break;
      case RETURN:
        if (this.state.showMenu) {
          let selected = options[activeIndex];
          selected && this._handleAddOption(selected);
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
      text = selectedOption[labelKey];
    }

    this.setState({
      activeIndex: 0,
      selected,
      showMenu: false,
      text,
    });

    onChange && onChange(selected);
    onInputChange && onInputChange(text);
  },

  _handleRemoveOption(removedOption) {
    let selected = this.state.selected.slice();
    selected = selected.filter((option) => !isEqual(option, removedOption));

    this.setState({
      activeIndex: 0,
      selected,
      showMenu: false,
    });

    this.props.onChange && this.props.onChange(selected);
  },

  /**
   * From `listensToClickOutside` HOC.
   */
  handleClickOutside(e) {
    this._hideDropdown();
  },

  _hideDropdown() {
    this.setState({
      activeIndex: 0,
      showMenu: false,
    });
  },
});

export default listensToClickOutside(Typeahead);
