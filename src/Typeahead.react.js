'use strict';

import React, {PropTypes} from 'react';

import TokenizerInput from './TokenizerInput.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import {find, head, isEmpty, isEqual, uniqueId} from 'lodash';
import {BACKSPACE, DOWN, ESC, RETURN, TAB, UP} from './keyCode';
import onClickOutside from 'react-onclickoutside';

require('../css/Typeahead.css');

/**
 * Typeahead
 */
const Typeahead = React.createClass({
  displayName: 'Typeahead',

  mixins: [onClickOutside],

  propTypes: {
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
     * Provides a hook for custom rendering of menu items. Note that this will
     * completely override the default method, and some behaviors may need to be
     * re-implemented.
     */
    renderMenuItem: PropTypes.func,
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
    const {defaultSelected, selected} = this.props;

    return {
      activeIndex: 0,
      selected: !isEmpty(defaultSelected) ? defaultSelected : selected,
      showMenu: false,
      text: '',
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
          emptyLabel={this.props.emptyLabel}
          labelKey={labelKey}
          maxHeight={this.props.maxHeight}
          onClick={this._handleAddOption}
          options={filteredOptions}
          initialResultCount={this.props.paginateResults}
          renderMenuItem={this.props.renderMenuItem}
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
    this.setState({
      activeIndex: 0,
      showMenu: true,
      text: e.target.value,
    });
  },

  _handleKeydown(options, e) {
    let {activeIndex} = this.state;

    switch (e.keyCode) {
      case BACKSPACE:
        // Don't let the browser go back.
        e.stopPropagation();
        break;
      case UP:
        // Prevent page from scrolling.
        e.preventDefault();

        activeIndex--;
        if (activeIndex < 0) {
          activeIndex = options.length - 1;
        }
        this.setState({activeIndex});
        break;
      case DOWN:
      case TAB:
        // Prevent page from scrolling.
        e.preventDefault();

        activeIndex++;
        if (activeIndex === options.length) {
          activeIndex = 0;
        }
        this.setState({activeIndex});
        break;
      case ESC:
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
    const {multiple, labelKey, onChange} = this.props;

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
   * From `onClickOutside` mixin.
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

export default Typeahead;
