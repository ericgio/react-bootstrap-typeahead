var React = require('react');

var cx = require('classnames');
var {PropTypes} = React;

var Menu = React.createClass({
  render: function() {
    return (
      <ul
        {...this.props}
        className={cx('dropdown-menu', this.props.className)}>
        {this.props.children}
      </ul>
    );
  }
});

var MenuItem = React.createClass({
  displayName: 'MenuItem',

  render: function() {
    return (
      <li className={cx({'disabled': this.props.disabled})}>
        <a href="#" onClick={this._handleClick}>
          {this.props.children}
        </a>
      </li>
    );
  },

  _handleClick: function(e) {
    e.preventDefault();
    this.props.onClick && this.props.onClick();
  }
});

var TypeaheadMenu = React.createClass({
  displayName: 'TypeaheadMenu',

  propTypes: {
    emptyLabel: PropTypes.string,
    labelKey: PropTypes.string.isRequired,
    maxHeight: PropTypes.number,
    options: PropTypes.array,
  },

  getDefaultProps: function() {
    return {
      emptyLabel: 'No matches found.',
      maxHeight: 300,
    };
  },

  render: function() {
    var {maxHeight, onKeyDown, options} = this.props;

    var items = options.length ?
      options.map(this._renderDropdownItem) :
      <MenuItem disabled>{this.props.emptyLabel}</MenuItem>;

    return (
      <Menu
        onKeyDown={onKeyDown}
        style={{
          maxHeight: maxHeight + 'px',
          right: 0,
        }}>
        {items}
      </Menu>
    );
  },

  _renderDropdownItem: function(option, idx) {
    return (
      <MenuItem
        key={idx}
        onClick={this.props.onClick.bind(null, option)}>
        {option[this.props.labelKey]}
      </MenuItem>
    );
  },
});

module.exports = TypeaheadMenu;
