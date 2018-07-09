import cx from 'classnames';
import PropTypes from 'prop-types';
import {isRequiredForA11y} from 'prop-types-extra';
import React, {Children} from 'react';

import {BaseMenuItem} from './MenuItem.react';

/**
 * Menu component that handles empty state when passed a set of results.
 */
class Menu extends React.Component {
  componentWillReceiveProps(nextProps) {

  }


  render() {
    const {
      children,
      className,
      emptyLabel,
      id,
      innerRef,
      maxHeight,
      multiple,
      style,
    } = this.props;

    const contents = Children.count(children) === 0 ?
      <BaseMenuItem disabled>
        {emptyLabel}
      </BaseMenuItem> :
      children;

    return (
      <ul
        aria-multiselectable={multiple? 'true' : 'false'}
        className={cx('rbt-menu', 'dropdown-menu', 'show', className)}
        id={id}
        ref={innerRef}
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
  maxHeight: '300px',
};

Menu.Divider = (props) => (
  <li className="divider dropdown-divider" role="separator" />
);

Menu.Header = (props) => (
  <li {...props} className="dropdown-header" />
);

export default Menu;
