import {
  FocusEvent,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  useState,
} from 'react';

import { isFunction } from '../utils';
import { Option, OptionHandler } from '../types';

export interface UseTokenProps<T> extends HTMLAttributes<T> {
  onBlur?: FocusEventHandler<T>;
  onClick?: MouseEventHandler<T>;
  onFocus?: FocusEventHandler<T>;
  onRemove?: OptionHandler;
  option: Option;
}

function useToken<T extends HTMLElement>({
  onBlur,
  onClick,
  onFocus,
  onRemove,
  option,
}: UseTokenProps<T>) {
  const [active, setActive] = useState<boolean>(false);

  const handleBlur = (e: FocusEvent<T>) => {
    setActive(false);
    onBlur?.(e);
  };

  const handleClick = (e: MouseEvent<T>) => {
    setActive(true);
    onClick?.(e);
  };

  const handleFocus = (e: FocusEvent<T>) => {
    setActive(true);
    onFocus?.(e);
  };

  const handleRemove = () => {
    onRemove?.(option);
  };

  const handleKeyDown = (e: KeyboardEvent<T>) => {
    if (e.key === 'Backspace' && active) {
      // Prevent browser from going back.
      e.preventDefault();
      handleRemove();
    }
  };

  return {
    active,
    onBlur: handleBlur,
    onClick: handleClick,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onRemove: isFunction(onRemove) ? handleRemove : undefined,
  };
}

export default useToken;
