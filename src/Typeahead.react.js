'use strict';

import React from 'react';

import TokenizerInput from './TokenizerInput.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import {find, head, isEmpty, isEqual} from 'lodash';
import {BACKSPACE, DOWN, ESC, RETURN, TAB, UP} from './keyCode';
import onClickOutside from 'react-onclickoutside';

const {PropTypes} = React;

require('../css/Typeahead.css');

/**
 * Typeahead
 */
const Typeahead = React.createClass({
  displayName: 'Typeahead',

  mixins: [onClickOutside],

  propTypes: {
    defaultSelected: PropTypes.array,
    /**
     * Message to display in the menu if there are no valid results.
     */
    emptyLabel: PropTypes.string,
    /**
     * Specify which option key to use for display. By default, the selector
     * will use the `label` key.
     */
    labelKey: PropTypes.string,
    maxHeight: PropTypes.number,
    /**
     * Whether or not multiple selections are allowed.
     */
    multiple: PropTypes.bool,
    /**
     * Full set of options, including pre-selected options.
     */
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    selected: PropTypes.array,
  },

  getDefaultProps() {
    return {
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
    const {labelKey, multiple, options} = this.props;
    let {activeIndex, selected, text} = this.state;

    // Filter out options that don't match the input string or, if multiple
    // selections are allowed, that have already been selected.
    let filteredOptions = options.filter((option) => {
      return !(
        option[labelKey].toLowerCase().indexOf(text.toLowerCase()) === -1 ||
        multiple && find(selected, option)
      );
    });

    let menu;
    if (this.state.showMenu) {
      menu =
        <TypeaheadMenu
          activeIndex={activeIndex}
          emptyLabel={this.props.emptyLabel}
          labelKey={labelKey}
          maxHeight={this.props.maxHeight}
          onClick={this._handleAddOption}
          options={filteredOptions}
        />;
    }

    let InputComponent = TokenizerInput;

    if (!multiple) {
      InputComponent = TypeaheadInput;
      selected = head(selected);
      text = (selected && selected[labelKey]) || text;
    }

    return (
      <div
        className="bootstrap-typeahead open"
        style={{position: 'relative'}}>
        <InputComponent
          filteredOptions={filteredOptions}
          labelKey={labelKey}
          onAdd={this._handleAddOption}
          onChange={this._handleTextChange}
          onFocus={this._handleFocus}
          onKeyDown={this._handleKeydown.bind(null, filteredOptions)}
          onRemove={this._handleRemoveOption}
          placeholder={this.props.placeholder}
          ref="input"
          selected={selected}
          text={text}
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
        let selected = options[activeIndex];
        selected && this._handleAddOption(selected);
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
