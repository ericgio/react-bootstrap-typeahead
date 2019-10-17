// @flow

import PropTypes from 'prop-types';
import React, { type ComponentType } from 'react';
import { RootCloseWrapper } from 'react-overlays';

import { getDisplayName, noop } from '../utils';
import { BACKSPACE } from '../constants';

import type { EventHandler } from '../types';

type Props = {
  onBlur: EventHandler,
  onClick: EventHandler,
  onFocus: EventHandler,
  onRemove: Function,
};

type State = {
  active: boolean,
};

const propTypes = {
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
};

const defaultProps = {
  onBlur: noop,
  onClick: noop,
  onFocus: noop,
};

/**
 * Higher-order component to encapsulate Token behaviors.
 */
const tokenContainer = (Component: ComponentType<*>) => {
  class WrappedComponent extends React.Component<Props, State> {
    static displayName = `tokenContainer(${getDisplayName(Component)})`;
    static propTypes = propTypes;
    static defaultProps = defaultProps;

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
            onClick={this._handleClick}
            onFocus={this._handleFocus}
            onKeyDown={this._handleKeyDown}
          />
        </RootCloseWrapper>
      );
    }

    _handleBlur = (e: SyntheticEvent<HTMLElement>) => {
      this._handleActiveChange(e, false, this.props.onBlur);
    }

    _handleClick = (e: SyntheticEvent<HTMLElement>) => {
      this._handleActiveChange(e, true, this.props.onClick);
    }

    _handleFocus = (e: SyntheticEvent<HTMLElement>) => {
      this._handleActiveChange(e, true, this.props.onFocus);
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

    _handleActiveChange = (
      e: SyntheticEvent<HTMLElement>,
      active: boolean,
      callback: EventHandler,
    ) => {
      // e.persist() isn't always present.
      e.persist && e.persist();
      e.stopPropagation();
      this.setState({ active }, () => callback(e));
    }
  }

  return WrappedComponent;
};

export default tokenContainer;
