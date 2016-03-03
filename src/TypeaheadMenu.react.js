'use strict';

import React from 'react';
import {findDOMNode} from 'react-dom';

import cx from 'classnames';

const {PropTypes} = React;

const Menu = React.createClass({
  render: function() {
    return (
      <ul
        {...this.props}
        className={cx('dropdown-menu', this.props.className)}>
        {this.props.children}
      </ul>
    );
  },
});

const MenuItem = React.createClass({
  displayName: 'MenuItem',

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.active) {
      findDOMNode(this).firstChild.focus();
    }
  },

  render: function() {
    return (
      <li
        className={cx({
          'active': this.props.active,
          'disabled': this.props.disabled,
        })}>
        <a href="#" onClick={this._handleClick}>
          {this.props.children}
        </a>
      </li>
    );
  },

  _handleClick: function(e) {
    e.preventDefault();
    this.props.onClick && this.props.onClick();
  },
});

const TypeaheadMenu = React.createClass({
  displayName: 'TypeaheadMenu',

  propTypes: {
    activeIndex: PropTypes.number,
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
    var {maxHeight, options} = this.props;

    var items = options.length ?
      options.map(this._renderDropdownItem) :
      <MenuItem disabled>{this.props.emptyLabel}</MenuItem>;

    return (
      <Menu
        style={{
          maxHeight: maxHeight + 'px',
          right: 0,
        }}>
        {items}
      </Menu>
    );
  },

  _renderDropdownItem: function(option, idx) {
    const {activeIndex, onClick} = this.props;

    return (
      <MenuItem
        active={idx === activeIndex}
        key={idx}
        onClick={onClick.bind(null, option)}>
        {option[this.props.labelKey]}
      </MenuItem>
    );
  },
});

module.exports = TypeaheadMenu;
