import { HTMLProps, useEffect, useRef } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import { useTypeaheadContext } from '../core/Context';
import { getMenuItemId, preventInputBlur } from '../utils';

import { Option } from '../types';

export interface UseItemProps<T> extends HTMLProps<T> {
  option: Option;
  position: number;
}

function useItem<T extends HTMLElement>({
  label,
  option,
  position,
  ...props
}: UseItemProps<T>) {
  const { activeIndex, id, isOnlyResult, onInitialItemChange, setItem } =
    useTypeaheadContext();

  const itemRef = useRef<T>(null);

  useEffect(() => {
    if (position === 0) {
      onInitialItemChange(option);
    }
  });

  useEffect(() => {
    if (position === activeIndex) {
      // Automatically scroll the menu as the user keys through it.
      const node = itemRef.current;

      node &&
        scrollIntoView(node, {
          boundary: node.parentNode as Element,
          scrollMode: 'if-needed',
        });
    }
  }, [activeIndex, option, position]);

  const active = isOnlyResult || activeIndex === position;

  // Update the item's position in the item stack.
  setItem(option, position);

  return {
    ...props,
    active,
    'aria-label': label,
    'aria-selected': active,
    id: getMenuItemId(id, position),
    onMouseDown: preventInputBlur,
    ref: itemRef,
    role: 'option',
  };
}

export default useItem;
