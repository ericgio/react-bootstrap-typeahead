import cx from 'classnames';
import React, {Children} from 'react';
import PropTypes from 'prop-types';
import {isRequiredForA11y} from 'prop-types-extra';

import {BaseMenuItem} from './MenuItem.react';

/**
 * Menu component that handles empty state when passed a set of results.
 */
class Menu extends React.Component {
  displayName = 'Menu';

  render() {
    const {
      align,
      children,
      className,
      emptyLabel,
      id,
      maxHeight,
      style,
    } = this.props;

    const contents = Children.count(children) === 0 ?
      <BaseMenuItem disabled>
        {emptyLabel}
      </BaseMenuItem> :
      children;

    return (
      <ul
        className={cx('rbt-menu', 'dropdown-menu', {
          'dropdown-menu-justify': align === 'justify',
          'dropdown-menu-right': align === 'right',
        }, className)}
        id={id}
        role="listbox"
        style={{
          ...style,
          display: 'block',
          maxHeight: maxHeight,
          overflow: 'auto',
        }}>
        {contents}
      </ul>
    );
  }
}

Menu.propTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: PropTypes.oneOf(['justify', 'left', 'right']),
  /**
   * Needed for accessibility.
   */
  id: isRequiredForA11y(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])),
  /**
   * Maximum height of the dropdown menu.
   */
  maxHeight: PropTypes.string,
};

Menu.defaultProps = {
  align: 'justify',
  maxHeight: '300px',
};

Menu.Divider = (props) => (
  <li className="divider dropdown-divider" role="separator" />
);

Menu.Header = (props) => (
  <li {...props} className="dropdown-header" />
);

export default Menu;
