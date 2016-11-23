import React from 'react';
import {findDOMNode} from 'react-dom';

import scrollIntoViewIfNeeded from '../utils/scrollIntoViewIfNeeded';

const menuItemBehaviors = Component => (
  React.createClass({
    componentWillReceiveProps(nextProps) {
      if (nextProps.active) {
        // Ensures that if the menu items exceed the bounds of the menu, the
        // menu will scroll up or down as the user hits the arrow keys.
        scrollIntoViewIfNeeded(findDOMNode(this));

        // Fire the change handler when the menu item becomes active.
        !this.props.active && this.props.onChange();
      }
    },

    render() {
      return <Component {...this.props} />;
    },
  })
);

export default menuItemBehaviors;
