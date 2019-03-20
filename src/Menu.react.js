import cx from 'classnames';
import PropTypes from 'prop-types';
import {isRequiredForA11y} from 'prop-types-extra';
import React, {Children} from 'react';

import {BaseMenuItem} from './MenuItem.react';
import {mapClassNamesToCssModules} from './utils';

/**
 * Menu component that handles empty state when passed a set of results.
 */
class Menu extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    const {inputHeight, scheduleUpdate} = this.props;

    // Update the menu position if the height of the input changes.
    if (inputHeight !== prevProps.inputHeight) {
      scheduleUpdate();
    }
  }

  render() {
    const {
      children,
      className,
      emptyLabel,
      id,
      innerRef,
      maxHeight,
      style,
      text,
      cssModules,
    } = this.props;

    const contents = Children.count(children) === 0 ?
      <BaseMenuItem disabled cssModules={cssModules}>
        {emptyLabel}
      </BaseMenuItem> :
      children;

    const classNames = cx('rbt-menu', 'dropdown-menu', 'show', className);
    return (
      <ul
        className={mapClassNamesToCssModules(classNames, cssModules)}
        id={id}
        key={
          // Force a re-render if the text changes to ensure that menu
          // positioning updates correctly.
          text
        }
        ref={innerRef}
        role="listbox"
        style={{
          ...style,
          display: 'block',
          maxHeight,
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
  <li
    className={
      mapClassNamesToCssModules(
        'divider dropdown-divider',
        props.cssModules
      )
    }
    role="separator"
  />
);

Menu.Header = (props) => (
  <li
    {...props}
    className={
      mapClassNamesToCssModules(
        'dropdown-header',
        props.cssModules
      )
    }
  />
);

export default Menu;
