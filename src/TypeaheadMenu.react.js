import Menu from './Menu.react';
import MenuItem from './MenuItem.react';
import React from 'react';

import cx from 'classnames';
import {map} from 'lodash/collection';
var {PropTypes} = React;

var TypeaheadMenu = React.createClass({
  displayName: 'TypeaheadMenu',

  propTypes: {
    emptyLabel: PropTypes.string,
    labelKey: PropTypes.string,
    maxHeight: PropTypes.number,
    options: PropTypes.array,
  },

  getDefaultProps: function() {
    return {
      emptyLabel: 'No matches found.',
      labelKey: 'label',
      maxHeight: 300,
    };
  },

  render: function() {
    var {maxHeight, onKeyDown, options} = this.props;

    var items = options.length ?
      map(options, this._renderDropdownItem) :
      <MenuItem disabled>{this.props.emptyLabel}</MenuItem>;

    return (
      <Menu
        onKeyDown={onKeyDown}
        style={{maxHeight: maxHeight + 'px'}}>
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
