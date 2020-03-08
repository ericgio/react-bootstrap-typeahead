// @flow

import scrollIntoView from 'scroll-into-view-if-needed';
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import type { ComponentType } from 'react';

import { useTypeaheadContext } from '../core/Context';
import { getDisplayName, getMenuItemId, preventInputBlur } from '../utils';

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

const menuItemContainer = (Component: ComponentType<*>) => {
  const displayName = `menuItemContainer(${getDisplayName(Component)})`;

  const WrappedMenuItem = ({ label, option, position, ...props }: Props) => {
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

    const active = isOnlyResult || activeIndex === position;

    // Update the item's position in the item stack.
    setItem(option, position);

    const handleClick = useCallback((e: SyntheticEvent<HTMLElement>) => {
      onMenuItemClick(option, e);
      props.onClick && props.onClick(e);
    });

    return (
      <Component
        {...props}
        active={active}
        aria-label={label}
        aria-selected={active}
        id={getMenuItemId(id, position)}
        onClick={handleClick}
        onMouseDown={preventInputBlur}
        ref={itemRef}
        role="option"
      />
    );
  };

  WrappedMenuItem.displayName = displayName;
  WrappedMenuItem.propTypes = propTypes;

  return WrappedMenuItem;
};

export default menuItemContainer;
