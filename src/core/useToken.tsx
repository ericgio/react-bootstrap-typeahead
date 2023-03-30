import {
  FocusEvent,
  FocusEventHandler,
  HTMLProps,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  useState,
} from 'react';

import useRootClose from './useRootClose';
import { isFunction } from '../utils';
import { Option, OptionHandler } from '../types';

export interface UseTokenProps<T> extends Omit<HTMLProps<T>, 'onBlur'> {
  // `onBlur` is typed more generically because it's passed to `useRootClose`,
  // which passes a generic event to the callback.
  onBlur?: (event: Event) => void;
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
  ...props
}: UseTokenProps<T>) {
  const [active, setActive] = useState<boolean>(false);

  const handleBlur = (e: Event) => {
    setActive(false);
    onBlur && onBlur(e);
  };

  const handleClick = (e: MouseEvent<T>) => {
    setActive(true);
    onClick && onClick(e);
  };

  const handleFocus = (e: FocusEvent<T>) => {
    setActive(true);
    onFocus && onFocus(e);
  };

  const handleRemove = () => {
    onRemove && onRemove(option);
  };

  const handleKeyDown = (e: KeyboardEvent<T>) => {
    if (e.key === 'Backspace' && active) {
      // Prevent browser from going back.
      e.preventDefault();
      handleRemove();
    }
  };

  const rootElementRef = useRootClose(handleBlur, {
    ...props,
    disabled: !active,
  });

  return {
    active,
    onBlur: handleBlur,
    onClick: handleClick,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onRemove: isFunction(onRemove) ? handleRemove : undefined,
    ref: rootElementRef,
  };
}

export default useToken;
