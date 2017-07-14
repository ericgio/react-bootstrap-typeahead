import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

import getDisplayName from '../utils/getDisplayName';
import scrollIntoViewIfNeeded from '../utils/scrollIntoViewIfNeeded';

const menuItemContainer = Component => {
  class WrappedMenuItem extends React.Component {
    componentWillMount() {
      this._updateInitialItem(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const currentlyActive = this.context.activeIndex === this.props.position;
      const {option, position} = nextProps;
      const {activeIndex, onActiveItemChange} = nextContext;

      if (position == null) {
        return;
      }

      // The item will become active.
      if (activeIndex === position) {
        // Ensures that if the menu items exceed the bounds of the menu, the
        // menu will scroll up or down as the user hits the arrow keys.
        scrollIntoViewIfNeeded(findDOMNode(this));

        // Fire the change handler when the menu item becomes active.
        !currentlyActive && onActiveItemChange(option);
      }

      this._updateInitialItem(nextProps);
    }

    render() {
      const {activeIndex, isOnlyResult} = this.context;
      const {position, ...props} = this.props;

      const active = isOnlyResult || activeIndex === position;

      return (
        <Component
          {...props}
          active={active}
          onClick={this._handleClick}
        />
      );
    }

    _handleClick = e => {
      const {option, onClick} = this.props;

      this.context.onMenuItemClick(option);
      onClick && onClick(e);
    }

    _updateInitialItem = props => {
      const {option, position} = props;
      if (position === 0) {
        this.context.onInitialItemChange(option);
      }
    }
  }

  WrappedMenuItem.displayName =
    `menuItemContainer(${getDisplayName(Component)})`;

  WrappedMenuItem.propTypes = {
    option: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    position: PropTypes.number,
  };

  WrappedMenuItem.contextTypes = {
    activeIndex: PropTypes.number.isRequired,
    isOnlyResult: PropTypes.bool.isRequired,
    onActiveItemChange: PropTypes.func.isRequired,
    onInitialItemChange: PropTypes.func.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
  };

  return WrappedMenuItem;
};

export default menuItemContainer;
