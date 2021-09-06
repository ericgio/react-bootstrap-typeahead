// @flow

import PropTypes from 'prop-types';
import React, { type ComponentType, useState } from 'react';
import { useRootClose } from 'react-overlays';

import { getDisplayName, isFunction } from '../utils';
import { BACKSPACE } from '../constants';

import { optionType } from '../propTypes';
import type { EventHandler, Option, OptionHandler } from '../types';

type Props = {
  onBlur?: EventHandler<HTMLElement>,
  onClick?: EventHandler<HTMLElement>,
  onFocus?: EventHandler<HTMLElement>,
  onRemove?: OptionHandler,
  option: Option,
};

const propTypes = {
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onRemove: PropTypes.func,
  option: optionType.isRequired,
};

export const useToken = ({
  onBlur,
  onClick,
  onFocus,
  onRemove,
  option,
  ...props
}: Props) => {
  const [active, setActive] = useState<boolean>(false);
  const [rootElement, attachRef] = useState<mixed>(null);

  const handleActiveChange = (
    e: SyntheticEvent<HTMLElement>,
    isActive: boolean,
    callback?: EventHandler<HTMLElement>
  ) => {
    e.stopPropagation();
    setActive(isActive);
    typeof callback === 'function' && callback(e);
  };

  const handleBlur = (e: SyntheticEvent<HTMLElement>) => {
    handleActiveChange(e, false, onBlur);
  };

  const handleClick = (e: SyntheticEvent<HTMLElement>) => {
    handleActiveChange(e, true, onClick);
  };

  const handleFocus = (e: SyntheticEvent<HTMLElement>) => {
    handleActiveChange(e, true, onFocus);
  };

  const handleRemove = () => {
    onRemove && onRemove(option);
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case BACKSPACE:
        if (active) {
          // Prevent backspace keypress from triggering the browser "back"
          // action.
          e.preventDefault();
          handleRemove();
        }
        break;
      default:
        break;
    }
  };

  useRootClose(rootElement, handleBlur, {
    ...props,
    disabled: !active,
  });

  return {
    ...props,
    active,
    onBlur: handleBlur,
    onClick: handleClick,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onRemove: isFunction(onRemove) ? handleRemove : undefined,
    ref: attachRef,
  };
};

export const withToken = (Component: ComponentType<*>) => {
  const displayName = `withToken(${getDisplayName(Component)})`;

  const WrappedToken = (props: Props) => <Component {...useToken(props)} />;

  WrappedToken.displayName = displayName;
  WrappedToken.propTypes = propTypes;

  return WrappedToken;
};
