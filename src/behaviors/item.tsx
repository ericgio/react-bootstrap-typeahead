import PropTypes from 'prop-types';
import React, {
  ComponentType,
  HTMLProps,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import { useTypeaheadContext } from '../core/Context';
import { getDisplayName, getMenuItemId, preventInputBlur } from '../utils';

import { optionType } from '../propTypes';
import { Option } from '../types';

const propTypes = {
  option: optionType.isRequired,
  position: PropTypes.number,
};

export interface UseItemProps<T> extends HTMLProps<T> {
  onClick?: MouseEventHandler<T>;
  option: Option;
  position: number;
}

export function useItem<T extends HTMLElement>({
  label,
  onClick,
  option,
  position,
  ...props
}: UseItemProps<T>) {
  const {
    activeIndex,
    id,
    isOnlyResult,
    onActiveItemChange,
    onInitialItemChange,
    onMenuItemClick,
    setItem,
  } = useTypeaheadContext();

  const itemRef = useRef<T>(null);

  useEffect(() => {
    if (position === 0) {
      onInitialItemChange(option);
    }
  });

  useEffect(() => {
    if (position === activeIndex) {
      onActiveItemChange(option);

      // Automatically scroll the menu as the user keys through it.
      const node = itemRef.current;

      node &&
        scrollIntoView(node, {
          block: 'nearest',
          boundary: node?.parentNode as Element,
          inline: 'nearest',
          scrollMode: 'if-needed',
        });
    }
  });

  const handleClick = useCallback(
    (e: MouseEvent<T>) => {
      onMenuItemClick(option, e);
      onClick && onClick(e);
    },
    [onClick, onMenuItemClick, option]
  );

  const active = isOnlyResult || activeIndex === position;

  // Update the item's position in the item stack.
  setItem(option, position);

  return {
    ...props,
    active,
    'aria-label': label,
    'aria-selected': active,
    id: getMenuItemId(id, position),
    onClick: handleClick,
    onMouseDown: preventInputBlur,
    ref: itemRef,
    role: 'option',
  };
}

/* istanbul ignore next */
export function withItem<T extends UseItemProps<HTMLElement>>(
  Component: ComponentType<T>
) {
  const WrappedMenuItem = (props: T) => (
    <Component {...props} {...useItem(props)} />
  );

  WrappedMenuItem.displayName = `withItem(${getDisplayName(Component)})`;
  WrappedMenuItem.propTypes = propTypes;

  return WrappedMenuItem;
}
