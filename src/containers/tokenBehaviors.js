import React from 'react';
import {findDOMNode} from 'react-dom';
import onClickOutside from 'react-onclickoutside';

import {BACKSPACE} from '../utils/keyCode';

/**
 * Higher-order component that encapsulates Token behaviors, allowing them to
 * be easily re-used.
 */
const tokenBehaviors = Component => {
  return onClickOutside(React.createClass({
    getInitialState() {
      return {
        selected: false,
      };
    },

    render() {
      return (
        <Component
          {...this.props}
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
    },
  }));
};

export default tokenBehaviors;
