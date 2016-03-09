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

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      findDOMNode(this).firstChild.focus();
    }
  },

  render() {
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

  _handleClick(e) {
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
    newSelectionPrefix: PropTypes.string,
    options: PropTypes.array,
  },

  getDefaultProps() {
    return {
      emptyLabel: 'No matches found.',
      maxHeight: 300,
      newSelectionPrefix: 'New selection:',
    };
  },

  render() {
    const {maxHeight, options} = this.props;

    let items = options.length ?
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

  _renderDropdownItem(option, idx) {
    const {activeIndex, newSelectionPrefix, onClick} = this.props;

    let label = option[this.props.labelKey];
    if (option.customOption) {
      label = `${newSelectionPrefix} ${label}`;
    }

    return (
      <MenuItem
        active={idx === activeIndex}
        key={idx}
        onClick={onClick.bind(null, option)}>
        {label}
      </MenuItem>
    );
  },
});

export default TypeaheadMenu;
