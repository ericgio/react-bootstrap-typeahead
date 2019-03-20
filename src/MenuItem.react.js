import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';

import menuItemContainer from './containers/menuItemContainer';
import {mapClassNamesToCssModules} from './utils';

class BaseMenuItem extends React.Component {
  render() {
    const {
      active,
      children,
      className,
      disabled,
      onClick,
      onMouseDown,
      cssModules,
      ...props
    } = this.props;

    const conditionalClassNames = {
      active,
      disabled,
    };

    return (
      /* eslint-disable jsx-a11y/anchor-is-valid */
      <li
        {...props}
        className={
          mapClassNamesToCssModules(
            cx(conditionalClassNames, className),
            cssModules
          )
        }>
        <a
          className={
            mapClassNamesToCssModules(
              cx('dropdown-item', conditionalClassNames),
              cssModules
            )
          }
          href="#"
          onClick={this._handleClick}
          onMouseDown={onMouseDown}>
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

export {BaseMenuItem};
export default menuItemContainer(BaseMenuItem);
