import {isEqual} from 'lodash';
import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import getDisplayName from '../utils/getDisplayName';
import scrollIntoViewIfNeeded from '../utils/scrollIntoViewIfNeeded';

const menuItemBehaviors = Component => (
  React.createClass({
    displayName: `menuItemBehaviors(${getDisplayName(Component)})`,

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

    componentWillReceiveProps(nextProps, nextContext) {
      const currentlyActive = this.context.activeIndex === this.props.position;
      const {option, position} = nextProps;
      const {
        activeIndex,
        onActiveItemChange,
        onInitialItemChange,
      } = nextContext;

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

      if (position === 0 && !isEqual(this.props.option, option)) {
        onInitialItemChange(option);
      }
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
  })
);

export default menuItemBehaviors;
