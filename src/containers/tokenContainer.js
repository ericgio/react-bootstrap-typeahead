import React from 'react';
import {findDOMNode} from 'react-dom';
import onClickOutside from 'react-onclickoutside';

import {getDisplayName} from '../utils/';
import {BACKSPACE} from '../constants/keyCode';

/**
 * Higher-order component that encapsulates Token behaviors, allowing them to
 * be easily re-used.
 */
const tokenContainer = (Component) => {
  class WrappedComponent extends React.Component {
    displayName = `tokenContainer(${getDisplayName(Component)})`;

    state = {
      selected: false,
    };

    render() {
      const {
        disableOnClickOutside,
        enableOnClickOutside,
        eventTypes,
        outsideClickIgnoreClass,
        preventDefault,
        stopPropagation,
        ...tokenProps
      } = this.props;

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
    }

    _handleBlur = (e) => {
      findDOMNode(this).blur();
      this.setState({selected: false});
      this.props.disableOnClickOutside && this.props.disableOnClickOutside();
    }

    _handleKeyDown = (e) => {
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
    }

    /**
     * From `onClickOutside` HOC.
     */
    handleClickOutside = (e) => {
      this._handleBlur();
    }

    _handleRemove = (e) => {
      this.props.onRemove && this.props.onRemove();
    }

    _handleSelect = (e) => {
      e.stopPropagation();
      this.setState({selected: true});
      this.props.enableOnClickOutside && this.props.enableOnClickOutside();
    }
  }

  return onClickOutside(WrappedComponent);
};

export default tokenContainer;
