'use strict';

import React, {PropTypes} from 'react';

import TokenizerInput from './TokenizerInput.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import {find, isEmpty, isEqual, uniqueId} from 'lodash';
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
     * Number of input characters that must be entered before showing results.
     */
    minLength: PropTypes.number,
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
      minLength: 0,
      multiple: false,
      selected: [],
    };
  },

  getInitialState() {
    const {defaultSelected} = this.props;

    let selected = this.props.selected.slice();
    if (!isEmpty(defaultSelected)) {
      selected = defaultSelected;
    }

    return {
      activeIndex: 0,
      selected,
      showMenu: false,
      text: '',
    };
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
    const {allowNew, labelKey, minLength, multiple} = this.props;
    const {activeIndex, selected, showMenu, text} = this.state;

    let filteredOptions = this._getFilteredOptions();

    if (!filteredOptions.length && allowNew && !!text.trim()) {
      let newOption = {
        id: uniqueId('new-id-'),
        customOption: true,
      };
      newOption[labelKey] = text;
      filteredOptions = [newOption];
    }

    let menu;
    if (showMenu && text.length >= minLength) {
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
          renderMenuItemChildren={this.props.renderMenuItemChildren}
          text={text}
        />;
    }

    let InputComponent = multiple ? TokenizerInput : TypeaheadInput;

    return (
      <div
        className="bootstrap-typeahead open"
        style={{position: 'relative'}}>
        <InputComponent
          disabled={this.props.disabled}
          filteredOptions={filteredOptions}
          labelKey={labelKey}
          onAdd={this._handleAddOption}
          onBlur={this._handleBlur}
          onChange={this._handleTextChange}
          onFocus={this._handleFocus}
          onKeyDown={e => this._handleKeydown(filteredOptions, e)}
          onRemove={this._handleRemoveOption}
          placeholder={this.props.placeholder}
          selected={selected.slice()}
          text={text}
        />
        {menu}
      </div>
    );
  },

  /**
   * Filter out options that don't match the input string or, if multiple
   * selections are allowed, that have already been selected.
   */
  _getFilteredOptions() {
    const {labelKey, minLength, multiple, options} = this.props;
    const {selected, text} = this.state;

    if (text.length < minLength) {
      return [];
    }

    return options.filter(option => {
      const labelString = option[labelKey];

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
  },

  _handleBlur(e) {
    // Note: Don't hide the menu here, since that interferes with other actions
    // like making a selection by clicking on a menu item.
    this.props.onBlur && this.props.onBlur(e);
  },

  _handleFocus() {
    this.setState({showMenu: true});
  },

  _handleTextChange(text) {
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
    selected = selected.filter(option => !isEqual(option, removedOption));

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
