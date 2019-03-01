// @flow

import React, { type ComponentType } from 'react';
import { RootCloseWrapper } from 'react-overlays';

import { getDisplayName } from '../utils';
import { BACKSPACE } from '../constants';

type Props = {
  onRemove: Function,
};

type State = {
  active: boolean,
};

/**
 * Higher-order component to encapsulate Token behaviors.
 */
const tokenContainer = (Component: ComponentType<*>) => {
  class WrappedComponent extends React.Component<Props, State> {
    static displayName = `tokenContainer(${getDisplayName(Component)})`;

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

    _handleBlur = (e: SyntheticEvent<HTMLElement>) => {
      this.setState({ active: false });
    }

    _handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
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

    _handleActive = (e: SyntheticEvent<HTMLElement>) => {
      e.stopPropagation();
      this.setState({ active: true });
    }
  }

  return WrappedComponent;
};

export default tokenContainer;
