import React from 'react';

import cx from 'classnames';

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

module.exports = Menu;
