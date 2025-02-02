import {
  autoUpdate,
  flip,
  Middleware,
  Placement,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import { useState } from 'react';

import { Align } from '../types';

export type ReferenceElement = HTMLElement | null;

export interface OverlayOptions {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align?: Align;
  /**
   * Specify whether the menu should appear above the input.
   */
  dropup?: boolean;
  /**
   * Whether or not to automatically adjust the position of the overlay when it
   * reaches the viewport boundaries.
   */
  flip?: boolean;
  /**
   * Whether to use the fixed position strategy for positioning the overlay, as
   * opposed to absolute positioning.
   */
  positionFixed?: boolean;
}

export function getMiddleware(props: Pick<OverlayOptions, 'align' | 'flip'>) {
  const middleware: Middleware[] = [];
  if (props.flip) {
    middleware.push(flip());
  }

  if (props.align !== 'right' && props.align !== 'left') {
    middleware.push(
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      })
    );
  }

  return middleware;
}

export function getPlacement(
  props: Pick<OverlayOptions, 'align' | 'dropup'>
): Placement {
  const x = props.align === 'right' ? 'end' : 'start';
  const y = props.dropup ? 'top' : 'bottom';

  return `${y}-${x}`;
}

export function useOverlay(
  referenceElement: ReferenceElement,
  options: OverlayOptions
) {
  const [floatingElement, attachRef] = useState<ReferenceElement>(null);
  const { floatingStyles } = useFloating({
    elements: {
      floating: floatingElement,
      reference: referenceElement,
    },
    middleware: getMiddleware(options),
    placement: getPlacement(options),
    strategy: options.positionFixed ? 'fixed' : 'absolute',
    whileElementsMounted: autoUpdate,
  });

  return {
    innerRef: attachRef,
    style: floatingStyles,
  };
}

export default useOverlay;
