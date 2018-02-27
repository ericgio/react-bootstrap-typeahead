import cx from 'classnames';
import React, {Children} from 'react';
import PropTypes from 'prop-types';
import {isRequiredForA11y} from 'prop-types-extra';

import {BaseMenuItem} from './MenuItem.react';

const BaseMenu = (props) => (
  <ul
    {...props}
    className={cx('dropdown-menu', props.className)}>
    {props.children}
  </ul>
);

/**
 * Menu component that automatically handles pagination and empty state when
 * passed a set of filtered and truncated results.
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
      <BaseMenu
        className={cx('rbt-menu', {
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
        {this._renderPaginationMenuItem()}
      </BaseMenu>
    );
  }

  /**
   * Allow user to see more results, if available.
   */
  _renderPaginationMenuItem() {
    const {children, onPaginate, paginate, paginationText} = this.props;

    if (paginate && Children.count(children)) {
      return [
        <li
          className="divider"
          key="pagination-item-divider"
          role="separator"
        />,
        <BaseMenuItem
          className="rbt-menu-paginator"
          key="pagination-item"
          onClick={onPaginate}>
          {paginationText}
        </BaseMenuItem>,
      ];
    }
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
  /**
   * Prompt displayed when large data sets are paginated.
   */
  paginationText: PropTypes.string,
};

Menu.defaultProps = {
  align: 'justify',
  maxHeight: '300px',
  paginate: true,
  paginationText: 'Display additional results...',
};


export default Menu;
