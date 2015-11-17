import React from 'react';
import cx from 'classnames';

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

module.exports = MenuItem;
