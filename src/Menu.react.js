import cx from 'classnames';
import PropTypes from 'prop-types';
import {isRequiredForA11y} from 'prop-types-extra';
import React, {Children} from 'react';
import {Popper} from 'react-popper';

import {BaseMenuItem} from './MenuItem.react';

function getModifiers({align, flip}) {
  return {
    computeStyles: {
      enabled: true,
      fn: (data) => {
        if (align === 'justify') {
          // Set the popper width to match the
          data.styles.width = data.offsets.reference.width;
        }
        return data;
      },
    },
    flip: {
      enabled: flip,
    },
    preventOverflow: {
      escapeWithReference: true,
    },
  };
}

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
      dropup,
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

    const xPlacement = align === 'right' ? 'end' : 'start';
    const yPlacement = dropup ? 'top' : 'bottom';

    return (
      <Popper
        className={cx('rbt-menu', 'dropdown-menu', 'show', className)}
        component="ul"
        id={id}
        modifiers={getModifiers(this.props)}
        placement={`${yPlacement}-${xPlacement}`}
        role="listbox"
        style={{
          ...style,
          display: 'block',
          maxHeight: maxHeight,
          overflow: 'auto',
        }}>
        {contents}
      </Popper>
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
