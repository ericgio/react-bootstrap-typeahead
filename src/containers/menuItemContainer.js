import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

import {getDisplayName, getMenuItemId, preventInputBlur, scrollIntoViewIfNeeded} from '../utils/';

const withContext = (Component) => {
  return class extends React.Component {
    static contextTypes = {
      activeIndex: PropTypes.number.isRequired,
      isOnlyResult: PropTypes.bool.isRequired,
      onActiveItemChange: PropTypes.func.isRequired,
      onInitialItemChange: PropTypes.func.isRequired,
      onMenuItemClick: PropTypes.func.isRequired,
    };

    render() {
      return <Component {...this.props} {...this.context} />;
    }
  };
};

const menuItemContainer = (Component) => {
  class WrappedMenuItem extends React.Component {
    componentDidMount() {
      this._updateInitialItem(this.props);
    }

    componentDidUpdate(prevProps, prevState) {
      const wasActive = prevProps.activeIndex === prevProps.position;
      const {activeIndex, onActiveItemChange, option, position} = this.props;

      if (position == null) {
        return;
      }

      // The item will become active.
      if (activeIndex === position) {
        // Ensures that if the menu items exceed the bounds of the menu, the
        // menu will scroll up or down as the user hits the arrow keys.
        scrollIntoViewIfNeeded(findDOMNode(this));

        // Fire the change handler when the menu item becomes active.
        !wasActive && onActiveItemChange(option);
      }

      this._updateInitialItem(this.props);
    }

    render() {
      const {
        activeIndex,
        isOnlyResult,
        label,
        onActiveItemChange,
        onInitialItemChange,
        onMenuItemClick,
        option,
        position,
        ...props
      } = this.props;

      const active = isOnlyResult || activeIndex === position;

      return (
        <Component
          {...props}
          active={active}
          aria-label={label}
          aria-selected={active}
          id={getMenuItemId(position)}
          onClick={this._handleClick}
          onMouseDown={preventInputBlur}
          role="option"
        />
      );
    }

    _handleClick = (e) => {
      const {onMenuItemClick, option, onClick} = this.props;

      onMenuItemClick(option, e);
      onClick && onClick(e);
    }

    _updateInitialItem = (props) => {
      const {onInitialItemChange, option, position} = props;
      if (position === 0) {
        onInitialItemChange(option);
      }
    }
  }

  WrappedMenuItem.displayName =
    `MenuItemContainer(${getDisplayName(Component)})`;

  WrappedMenuItem.propTypes = {
    option: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    position: PropTypes.number,
  };

  return withContext(WrappedMenuItem);
};

export default menuItemContainer;
