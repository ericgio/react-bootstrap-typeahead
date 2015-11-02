var React =require('react');
var {OverlayTrigger, Tooltip} = require('react-bootstrap');

var cx = require('classnames');

var keyCode = require('./keyCode');

/**
 * Token
 *
 * Individual token component, generally displayed within the Tokenizer
 * component, but can also be rendered on its own.
 */
var Token = React.createClass({
  displayName: 'Token',

  propTypes: {
    /**
     * Whether this token is a custom token or not.
     */
    custom: React.PropTypes.bool,
    /**
     * Render a version of the token for display purposes. In this case it
     * cannot be removed and will not have most of the interaction options that
     * the token would otherwise have as part of a tokenizer. If an href is
     * provided, the token will be displayed as a link.
     */
    displayOnly: React.PropTypes.bool,
    label: React.PropTypes.string.isRequired,
    /**
     * Optionally display a tooltip on hover.
     */
    tooltip: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      displayOnly: false
    };
  },

  getInitialState: function() {
    return {
      selected: false
    };
  },

  componentDidMount: function() {
    // Listen for clicks within the direct parent as well as the window to see
    // if we should blur the token, since the parent may stop propagation under
    // certain conditions.
    var parentNode = this.getDOMNode().parentNode;
    parentNode.addEventListener('click', this._handleClick);
    window.addEventListener('click', this._handleClick);
  },

  componentWillUnmount: function() {
    var parentNode = this.getDOMNode().parentNode;
    parentNode.removeEventListener('click', this._handleClick);
    window.removeEventListener('click', this._handleClick);
  },

  render: function() {
    var token = this.props.displayOnly ?
      this._renderDisplayOnlyToken() : this._renderInteractiveToken();

    if (!this.props.tooltip) {
      return token;
    }

    return (
      <OverlayTrigger
        overlay={<Tooltip>{this.props.tooltip}</Tooltip>}
        placement="top">
        {token}
      </OverlayTrigger>
    );
  },

  _renderInteractiveToken: function() {
    return (
      <button
        className={cx({
          'token-custom': this.props.custom,
          'token': true,
          'token-selected': this.state.selected
        }, this.props.className)}
        onBlur={this._handleBlur}
        onClick={this._handleSelect}
        onFocus={this._handleSelect}
        onKeyDown={this._handleKeyDown}
        tabIndex={0}>
        {this.props.label}
        <span className="token-close-button" onClick={this._handleRemove}>
          &times;
        </span>
      </button>
    );
  },

  _renderDisplayOnlyToken: function() {
    var classnames = cx(
      'token token-display-only',
      this.props.className
    );

    if (this.props.href) {
      return (
        <a className={classnames} href={this.props.href}>
          {this.props.label}
        </a>
      );
    }

    return (
      <div className={classnames}>
        {this.props.label}
      </div>
    );
  },

  _handleBlur: function(evt) {
    this.getDOMNode().blur();
    this.setState({selected: false});
  },

  _handleClick: function(evt) {
    // If the user clicks outside the token, deselect the token.
    var token = this.getDOMNode();
    if (!token.contains(evt.target) && token !== evt.target) {
      this._handleBlur();
    }
  },

  _handleKeyDown: function(evt) {
    switch (evt.keyCode) {
      case keyCode.BACKSPACE:
        if (this.state.selected) {
          // Prevent backspace keypress from triggering the browser "back"
          // action.
          evt.preventDefault();
          this._handleRemove();
        }
        break;
    }
  },

  _handleRemove: function(evt) {
    this.props.onRemove && this.props.onRemove();
  },

  _handleSelect: function(evt) {
    this.getDOMNode().focus();
    this.setState({selected: true});
  }
});

module.exports = Token;
