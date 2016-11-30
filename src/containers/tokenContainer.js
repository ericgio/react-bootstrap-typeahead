import React from 'react';
import {omit} from 'lodash';
import {findDOMNode} from 'react-dom';
import onClickOutside from 'react-onclickoutside';

import getDisplayName from '../utils/getDisplayName';
import {BACKSPACE} from '../utils/keyCode';

/**
 * Higher-order component that encapsulates Token behaviors, allowing them to
 * be easily re-used.
 */
const tokenContainer = Component => {
  const WrappedComponent = React.createClass({
    displayName: `tokenContainer(${getDisplayName(Component)})`,

    getInitialState() {
      return {
        selected: false,
      };
    },

    render() {
      const tokenProps = omit(this.props, [
        'disableOnClickOutside',
        'enableOnClickOutside',
      ]);

      return (
        <Component
          {...tokenProps}
          {...this.state}
          onBlur={this._handleBlur}
          onClick={this._handleSelect}
          onFocus={this._handleSelect}
          onKeyDown={this._handleKeyDown}
        />
      );
    },

    _handleBlur(e) {
      findDOMNode(this).blur();
      this.setState({selected: false});
      this.props.disableOnClickOutside && this.props.disableOnClickOutside();
    },

    _handleKeyDown(e) {
      switch (e.keyCode) {
        case BACKSPACE:
          if (this.state.selected) {
            // Prevent backspace keypress from triggering the browser "back"
            // action.
            e.preventDefault();
            this._handleRemove();
          }
          break;
      }
    },

    /**
     * From `onClickOutside` HOC.
     */
    handleClickOutside(e) {
      this._handleBlur();
    },

    _handleRemove(e) {
      this.props.onRemove && this.props.onRemove();
    },

    _handleSelect(e) {
      e.stopPropagation();
      this.setState({selected: true});
      this.props.enableOnClickOutside && this.props.enableOnClickOutside();
    },
  });

  return onClickOutside(WrappedComponent);
};

export default tokenContainer;
