import cx from 'classnames';
import {noop} from 'lodash';
import * as React from 'react';

import menuItemContainer from './containers/menuItemContainer';

class BaseMenuItem extends React.Component {
  render() {
    const {active, children, className, disabled} = this.props;
    const conditionalClassNames = {
      'active': active,
      'disabled': disabled,
    };

    return (
      <li
        className={cx(conditionalClassNames, className)}>
        <a
          className={cx('dropdown-item', conditionalClassNames)}
          href="#"
          onClick={this._handleClick}
          role="button">
          {children}
        </a>
      </li>
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
