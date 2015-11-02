var React =require('react');
var Token = require('./token');

var {cloneWithProps} = React.addons;
var cx = require('classnames');
var keyCode = require('./keyCode');

function sortOptions(options) {
  return _.sortBy(options, 'name');
}

/**
 * Tokenizer
 *
 * Allows a user to search for, and select, multiple items from a given
 * collection. Possible options are displayed in a dropdown, and users can
 * filter the list by typing in characters that match what they're looking for.
 * Selected items are displayed as tokens, which can be removed.
 */
var Tokenizer = React.createClass({
  displayName: 'Tokenizer',

  propTypes: {
    /**
     * Allow custom tokens to be created (they will have {custom: true} set)
     */
    allowCustom: React.PropTypes.bool,
    /**
     * A custom class that will be applied to the root element
     */
    className: React.PropTypes.string,
    /**
     * Pre-selected options to display as tokens by default.
     */
    defaultSelected: React.PropTypes.array,
    /**
     * Maximum number of matching results to display in the typeahead dropdown.
     */
    maxResults: React.PropTypes.number,
    /**
     * Specify which option property to use as the display label in the token
     * and typeahead dropdown.
     */
    optionLabelProp: React.PropTypes.string,
    /**
     * Full set of options, including pre-selected options.
     */
    options: React.PropTypes.array.isRequired,
    /**
     * Input element placeholder
     */
    placeholder: React.PropTypes.string,
    /**
     * The selected options
     */
    selected: React.PropTypes.array,
    /**
     * Function by which to sort the list of available options.
     */
    sortOptions: React.PropTypes.func,
    /**
     * Optionally pass a custom token element to handle special rendering or
     * behavior. For example, custom classnames or tooltips.
     */
    token: React.PropTypes.element
  },

  getDefaultProps: function() {
    return {
      allowCustom: false,
      defaultSelected: [],
      maxResults: 10,
      optionLabelProp: 'name',
      sortOptions: sortOptions
    };
  },

  getInitialState: function() {
    // Filter out any pre-selected options from the available set.
    var selectedIds = _.pluck(this.props.defaultSelected, 'id');
    var options = _.filter(this.props.options, function(option) {
      return selectedIds.indexOf(option.id) === -1;
    });

    return {
      focusedMenuItem: null,
      options: this.props.sortOptions(options),
      selected: this.props.defaultSelected,
      showDropdown: false,
      text: ''
    };
  },

  componentDidMount: function() {
    window.addEventListener('click', this._handleWindowClick);
  },

  componentWillUnmount: function() {
    window.removeEventListener('click', this._handleWindowClick);
  },

  componentWillReceiveProps: function(nextProps) {
    if (_.has(nextProps, 'selected')) {
      // Handle setting the selected options explicitly
      this.setState({
        selected: nextProps.selected
      });
    }
  },

  render: function () {
    var defaultClasses = cx({
      'tokenizer': true,
      'tokenizer-focus': this.state.showDropdown
    });
    return (
      <div
        className={joinClasses(defaultClasses, this.props.className)}
        onClick={this._handleTokenizerClick}>
        <span onClick={this._handleTokensClick}>
          {_.map(this.state.selected, this._renderToken)}
        </span>
        <input
          className="typeahead-input"
          onChange={this._handleTextChange}
          onFocus={this._handleFocus}
          onKeyDown={this._handleKeydown}
          ref="input"
          type="text"
          value={this.state.text}
        />
        {this._renderPlaceholderText()}
        <div className="typeahead">
          {this._renderDropdown()}
        </div>
      </div>
    );
  },

  _renderToken: function(option, idx) {
    if (this.props.token) {
      return cloneWithProps(this.props.token, {
        key: idx,
        onRemove: this._handleRemoveOption.bind(this, option),
        option: option
      });
    }

    return (
      <Token
        custom={option.custom}
        key={option.id}
        label={option[this.props.optionLabelProp]}
        onRemove={this._handleRemoveOption.bind(this, option)}
      />
    );
  },

  /**
   * Text that behaves like a placeholder in a normal text input. Hide if there
   * are any tokens in the tokenizer or if the user has typed any characters.
   */
  _renderPlaceholderText: function() {
    var placeholder = this.props.placeholder;
    if (placeholder && !this.state.text && !this.state.selected.length) {
      return (
        <div className="tokenizer-placeholder">
          {this.props.placeholder}
        </div>
      );
    }
  },

  _renderDropdown: function() {
    if (!this.state.showDropdown) {
      return;
    }

    var text = this.state.text.toLowerCase();
    var options = _.filter(this.state.options, function(option) {
      return option.name.toLowerCase().indexOf(text) !== -1;
    }).slice(0, this.props.maxResults);

    var noResultText = this.props.allowCustom ?
      'Press enter to add "' + this.state.text + '"' :
      'No matches found.';

    var content = options.length ?
      <ul className="typeahead-list" onKeyDown={this._handleKeydown} ref="list">
        {_.map(options, this._renderDropdownItem)}
      </ul> :
      <div className="typeahead-noresults">
        {noResultText}
      </div>;

    return (
      <div className="typeahead-dropdown">
        {content}
      </div>
    );
  },

  _renderDropdownItem: function(option, idx) {
    return (
      <li className="typeahead-list-item" key={option.id} tabIndex={idx}>
        <a
          className="typeahead-list-item-link"
          href="javascript:;"
          onClick={this._handleAddOption.bind(this, option)}>
          {option[this.props.optionLabelProp]}
        </a>
      </li>
    );
  },

  _hideDropdown: function() {
    this.refs.input.getDOMNode().blur();
    this.setState({
      showDropdown: false,
      focusedMenuItem: null
    });
  },

  _handleFocus: function() {
    this.setState({showDropdown: true});
  },

  _handleTextChange: function(evt) {
    this.setState({text: evt.target.value});
  },

  _handleKeydown: function(evt) {
    var focusedMenuItem = this.state.focusedMenuItem;

    switch (evt.keyCode) {
      case keyCode.UP:
      case keyCode.DOWN:
        // Prevent page from scrolling when pressing up or down.
        evt.preventDefault();

        // Try to get the menu list. It won't be there if there are no results.
        var list = this.refs.list && this.refs.list.getDOMNode();
        if (!list) {
          return;
        }

        if (evt.keyCode === keyCode.UP) {
          // Get the previous item or go back to the bottom if we're at the top.
          focusedMenuItem =
            (focusedMenuItem && focusedMenuItem.previousSibling) ||
            list.lastChild;
        } else if (evt.keyCode === keyCode.DOWN) {
          // Get the next item or go back to the top if we're at the bottom.
          focusedMenuItem =
            (focusedMenuItem && focusedMenuItem.nextSibling) ||
            list.firstChild;
        }

        focusedMenuItem.focus();
        this.setState({focusedMenuItem: focusedMenuItem});
        break;
      case keyCode.LEFT:
      case keyCode.RIGHT:
        // TODO: Tab forward and backward through tokens when user clicks left
        // or right arrow keys.
        break;
      case keyCode.ESC:
        // Prevent things like unintentionally closing dialogs.
        evt.stopPropagation();
        this._hideDropdown();
        break;
      case keyCode.RETURN:
        if (focusedMenuItem) {
          // Simulate clicking on the anchor.
          focusedMenuItem.firstChild.click();
          this._hideDropdown();
        } else if (this.props.allowCustom && !_.isEmpty(this.state.text)) {
          // Add a custom token
          var option = {
            custom: true,
            id: _.uniqueId('tokenizer')
          };
          option[this.props.optionLabelProp] = this.state.text;

          this._handleAddOption(option);
          this._hideDropdown();
        }
        break;
      case keyCode.BACKSPACE:
        if (this.state.showDropdown && !this.state.text) {
          // TODO: If the input is selected and there is no text, focus/select
          // the last token when the user hits backspace.
        }
        break;
    }
  },

  _handleAddOption: function(selectedOption) {
    // Add the newly-selected option to the list of selected options.
    var selected = this.state.selected.slice();
    selected.push(selectedOption);

    // Remove the newly-selected course from the list of available options.
    var options = _.filter(this.state.options, function(option) {
      return option.id !== selectedOption.id;
    });

    this.setState({
      options: options,
      selected: selected,
      showDropdown: false,
      text: ''
    });

    this.props.onChange && this.props.onChange(selected);
  },

  _handleRemoveOption: function(selectedOption) {
    var selected = _.filter(this.state.selected, function(option) {
      return option.id !== selectedOption.id;
    });

    var options = this.state.options.slice();
    if (!selectedOption.custom) {
      options.push(selectedOption);
    }

    this.setState({
      options: this.props.sortOptions(options),
      selected: selected,
    });

    this.props.onChange && this.props.onChange(selected);
  },

  _handleTokensClick: function(evt) {
    var className = evt.target.getAttribute('class');
    if (
      !className ||
      (className && className.indexOf('token-container') === -1)
    ) {
      // If the user clicks on one of the tokens, stop the event from
      // bubbling to prevent the input from focusing.
      evt.stopPropagation();
      this._hideDropdown();
    }
  },

  _handleTokenizerClick: function(evt) {
    // If the user clicks anywhere inside the tokenizer besides a token,
    // focus the input.
    this.refs.input.getDOMNode().focus();
  },

  _handleWindowClick: function(evt) {
    // If the user clicks outside the tokenizer, close the dropdown.
    if (!this.getDOMNode().contains(evt.target)) {
      this._hideDropdown();
    }
  }
});

module.exports = Tokenizer;
