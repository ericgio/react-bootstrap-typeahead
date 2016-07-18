'use strict';

import Highlight from 'react-highlighter';
import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import cx from 'classnames';

const Menu = props => (
  <ul
    {...props}
    className={cx('dropdown-menu', props.className)}>
    {props.children}
  </ul>
);

const MenuItem = React.createClass({
  displayName: 'MenuItem',

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      findDOMNode(this).firstChild.focus();
    }
  },

  render() {
    const {active, children, className, disabled} = this.props;

    return (
      <li
        className={cx({
          'active': active,
          'disabled': disabled,
        }, className)}>
        <a href="#" onClick={this._handleClick}>
          {children}
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
    align: PropTypes.oneOf(['justify', 'left', 'right']),
    emptyLabel: PropTypes.string,
    initialResultCount: PropTypes.number,
    labelKey: PropTypes.string.isRequired,
    maxHeight: PropTypes.number,
    newSelectionPrefix: PropTypes.string,
    options: PropTypes.array,
    renderMenuItemChildren: PropTypes.func,
    text: PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      align: 'justify',
      emptyLabel: 'No matches found.',
      initialResultCount: 100,
      maxHeight: 300,
      newSelectionPrefix: 'New selection:',
    };
  },

  getInitialState() {
    return {
      /**
       * Max number of results to display, for performance reasons. If this
       * number is less than the number of available results, the user will see
       * an option to display more results.
       */
      resultCount: this.props.initialResultCount,
    };
  },

  render() {
    const {align, maxHeight, options} = this.props;

    // Render the max number of results or all results.
    let results = options.slice(0, this.state.resultCount || options.length);
    results = results.length ?
      results.map(this._renderMenuItem) :
      <MenuItem disabled>{this.props.emptyLabel}</MenuItem>;

    // Allow user to see more results, if available.
    let paginationItem;
    let separator;
    if (results.length < options.length) {
      paginationItem =
        <MenuItem
          className="bootstrap-typeahead-menu-paginator"
          onClick={this._handlePagination}>
          Display next {this.props.initialResultCount} results...
        </MenuItem>;
      separator = <li className="divider" role="separator" />;
    }

    return (
      <Menu
        className={cx('bootstrap-typeahead-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right',
        })}
        style={{
          maxHeight: maxHeight + 'px',
          overflow: 'auto',
        }}>
        {results}
        {separator}
        {paginationItem}
      </Menu>
    );
  },

  _renderMenuItem(option, idx) {
    const {
      activeIndex,
      labelKey,
      newSelectionPrefix,
      onClick,
      renderMenuItemChildren,
      text,
    } = this.props;

    let menuItemProps = {
      active: idx === activeIndex,
      key: idx,
      onClick: () => onClick(option),
    };

    return renderMenuItemChildren ?
      <MenuItem {...menuItemProps}>
        {renderMenuItemChildren(this.props, option, idx)}
      </MenuItem> :
      <MenuItem {...menuItemProps}>
        {option.customOption && `${newSelectionPrefix} `}
        <Highlight search={text}>
          {option[labelKey]}
        </Highlight>
      </MenuItem>;
  },

  _handlePagination(e) {
    let resultCount = this.state.resultCount + this.props.initialResultCount;
    this.setState({resultCount});
  },
});

export default TypeaheadMenu;
