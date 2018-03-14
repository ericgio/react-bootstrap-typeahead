import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';

import menuItemContainer from './containers/menuItemContainer';

class BaseMenuItem extends React.Component {
  render() {
    const {active, children, className, disabled, label, ...props} = this.props;
    const conditionalClassNames = {
      'active': active,
      'disabled': disabled,
    };

    return (
      /* eslint-disable jsx-a11y/anchor-is-valid */
      <li
        aria-label={label}
        aria-selected={active}
        className={cx(conditionalClassNames, className)}
        role="option">
        <a
          {...props}
          className={cx('dropdown-item', conditionalClassNames)}
          href="#"
          onClick={this._handleClick}>
          {children}
        </a>
      </li>
      /* eslint-enable jsx-a11y/anchor-is-valid */
    );
  }

  _handleClick = (e) => {
    const {disabled, onClick} = this.props;

    e.preventDefault();
    !disabled && onClick(e);
  }
}

BaseMenuItem.defaultProps = {
  onClick: noop,
};

const MenuItem = menuItemContainer(BaseMenuItem);

export {BaseMenuItem};
export default MenuItem;
