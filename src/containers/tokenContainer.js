// @flow

import PropTypes from 'prop-types';
import React, { type ComponentType } from 'react';
import { RootCloseWrapper } from 'react-overlays';

import { getDisplayName, isFunction, noop } from '../utils';
import { BACKSPACE } from '../constants';

import { optionType } from '../propTypes';
import type { EventHandler, Option, OptionHandler } from '../types';

type Props = {
  onBlur: EventHandler<HTMLElement>,
  onClick: EventHandler<HTMLElement>,
  onFocus: EventHandler<HTMLElement>,
  onRemove?: OptionHandler,
  option: Option,
};

type State = {
  active: boolean,
};

const propTypes = {
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onRemove: PropTypes.func,
  option: optionType.isRequired,
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
      const { onRemove } = this.props;
      const { active } = this.state;

      return (
        <RootCloseWrapper
          disabled={!active}
          onRootClose={this._handleBlur}>
          <Component
            {...this.props}
            active={active}
            onBlur={this._handleBlur}
            onClick={this._handleClick}
            onFocus={this._handleFocus}
            onKeyDown={this._handleKeyDown}
            onRemove={isFunction(onRemove) ? this._handleRemove : undefined}
          />
        </RootCloseWrapper>
      );
    }

    _handleActiveChange = (
      e: SyntheticEvent<HTMLElement>,
      active: boolean,
      callback: EventHandler<HTMLElement>,
    ) => {
      // e.persist() isn't always present.
      e.persist && e.persist();
      e.stopPropagation();
      this.setState({ active }, () => callback(e));
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
            this._handleRemove();
          }
          break;
        default:
          break;
      }
    }

    _handleRemove = () => {
      const { onRemove, option } = this.props;

      // Flow having trouble with `isFunction` here for some reason...
      if (typeof onRemove === 'function') {
        onRemove(option);
      }
    }
  }

  return WrappedComponent;
};

export default tokenContainer;
