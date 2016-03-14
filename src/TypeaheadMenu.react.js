'use strict';

import Highlight from 'react-highlighter';
import React from 'react';
import {findDOMNode} from 'react-dom';

import cx from 'classnames';

const {PropTypes} = React;

const Menu = React.createClass({
  render() {
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
    text: PropTypes.string.isRequired,
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
      options.map(this._renderMenuItem) :
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

  _renderMenuItem(option, idx) {
    const {
      activeIndex,
      labelKey,
      newSelectionPrefix,
      onClick,
      text,
    } = this.props;

    return (
      <MenuItem
        active={idx === activeIndex}
        key={idx}
        onClick={onClick.bind(null, option)}>
        {option.customOption && `${newSelectionPrefix} `}
        <Highlight search={text}>
          {option[labelKey]}
        </Highlight>
      </MenuItem>
    );
  },
});

export default TypeaheadMenu;
