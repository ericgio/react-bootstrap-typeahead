import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {findDOMNode} from 'react-dom';

import getDisplayName from '../utils/getDisplayName';
import scrollIntoViewIfNeeded from '../utils/scrollIntoViewIfNeeded';

const menuItemContainer = Component => (
  createReactClass({
    displayName: `menuItemContainer(${getDisplayName(Component)})`,

    propTypes: {
      option: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
      ]).isRequired,
      position: PropTypes.number,
    },

    contextTypes: {
      activeIndex: PropTypes.number.isRequired,
      onActiveItemChange: PropTypes.func.isRequired,
      onInitialItemChange: PropTypes.func.isRequired,
      onMenuItemClick: PropTypes.func.isRequired,
    },

    componentWillMount() {
      this._updateInitialItem(this.props);
    },

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
    },

    render() {
      const {activeIndex, onMenuItemClick} = this.context;
      const {option, position, ...props} = this.props;

      return (
        <Component
          {...props}
          active={activeIndex === position}
          onClick={() => onMenuItemClick(option)}
        />
      );
    },

    _updateInitialItem(props) {
      const {option, position} = props;
      if (position === 0) {
        this.context.onInitialItemChange(option);
      }
    },
  })
);

export default menuItemContainer;
