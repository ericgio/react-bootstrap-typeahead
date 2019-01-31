import React from 'react';
import { RootCloseWrapper } from 'react-overlays';

import { getDisplayName } from '../utils';
import { BACKSPACE } from '../constants';

/**
 * Higher-order component that encapsulates Token behaviors, allowing them to
 * be easily re-used.
 */
const tokenContainer = (Component) => {
  class WrappedComponent extends React.Component {
    state = {
      active: false,
    };

    render() {
      return (
        <RootCloseWrapper onRootClose={this._handleBlur}>
          <Component
            {...this.props}
            {...this.state}
            onBlur={this._handleBlur}
            onClick={this._handleActive}
            onFocus={this._handleActive}
            onKeyDown={this._handleKeyDown}
          />
        </RootCloseWrapper>
      );
    }

    _handleBlur = (e) => {
      this.setState({ active: false });
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
        default:
          break;
      }
    }

    _handleActive = (e) => {
      e.stopPropagation();
      this.setState({ active: true });
    }
  }

  WrappedComponent.displayName = `TokenContainer(${getDisplayName(Component)})`;

  return WrappedComponent;
};

export default tokenContainer;
