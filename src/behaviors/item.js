// @flow

import scrollIntoView from 'scroll-into-view-if-needed';
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import type { ComponentType } from 'react';

import { useTypeaheadContext } from '../core/Context';
import { getDisplayName, getMenuItemId, preventInputBlur, warn } from '../utils';

import { optionType } from '../propTypes';
import type { Option } from '../types';

const propTypes = {
  option: optionType.isRequired,
  position: PropTypes.number,
};

type Props = * & {
  option: Option,
  position: number,
};

export const useItem = ({ label, option, position, ...props }: Props) => {
  const {
    activeIndex,
    id,
    isOnlyResult,
    onActiveItemChange,
    onInitialItemChange,
    onMenuItemClick,
    setItem,
  } = useTypeaheadContext();

  const itemRef = useRef<?HTMLElement>(null);

  useEffect(() => {
    if (position === 0) {
      onInitialItemChange(option);
    }
  }, [position]);

  useEffect(() => {
    if (position === activeIndex) {
      onActiveItemChange(option);

      // Automatically scroll the menu as the user keys through it.
      const node = itemRef.current;

      node && scrollIntoView(node, {
        block: 'nearest',
        boundary: node.parentNode,
        inline: 'nearest',
        scrollMode: 'if-needed',
      });
    }
  }, [activeIndex, position]);

  const onClick = useCallback((e: SyntheticEvent<HTMLElement>) => {
    onMenuItemClick(option, e);
    props.onClick && props.onClick(e);
  });

  const active = isOnlyResult || activeIndex === position;

  // Update the item's position in the item stack.
  setItem(option, position);

  return {
    ...props,
    active,
    'aria-label': label,
    'aria-selected': active,
    id: getMenuItemId(id, position),
    onClick,
    onMouseDown: preventInputBlur,
    ref: itemRef,
    role: 'option',
  };
};

export const withItem = (Component: ComponentType<*>) => {
  const displayName = `withItem(${getDisplayName(Component)})`;

  const WrappedMenuItem = (props: Props) => <Component {...useItem(props)} />;

  WrappedMenuItem.displayName = displayName;
  WrappedMenuItem.propTypes = propTypes;

  return WrappedMenuItem;
};

export default function menuItemContainer(Component: ComponentType<*>) {
  /* istanbul ignore next */
  warn(
    false,
    'The `menuItemContainer` export is deprecated; use `withItem` instead.'
  );
  /* istanbul ignore next */
  return withItem(Component);
}
