import * as React from 'react';
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
      active: false,
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
          onClick={this._handleActive}
          onFocus={this._handleActive}
          onKeyDown={this._handleKeyDown}
        />
      );
    }

    _handleBlur = (e) => {
      this.setState({active: false});
    }

    _handleKeyDown = (e) => {
      switch (e.keyCode) {
        case BACKSPACE:
          if (this.state.active) {
            // Prevent backspace keypress from triggering the browser "back"
            // action.
            e.preventDefault();
            this.props.onRemove();
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

    _handleActive = (e) => {
      e.stopPropagation();
      this.setState({active: true});
    }
  }

  return onClickOutside(WrappedComponent);
};

export default tokenContainer;
