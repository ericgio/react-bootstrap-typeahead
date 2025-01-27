import { useState } from 'react';
import { autoUpdate, flip, type Middleware, type Placement, size, useFloating } from '@floating-ui/react';

import { Align } from '../../types';

export type ReferenceElement = HTMLElement | null;

export interface OverlayOptions {
  align?: Align;
  dropup?: boolean;
  flip?: boolean;
  positionFixed?: boolean;
}

export function getMiddleware(props: Pick<OverlayOptions, 'align' | 'flip'>) {
  const middleware: Middleware[] = [];
  if (props.flip) {
    middleware.push(flip());
  }

  if (props.align !== 'right' && props.align !== 'left') {
    middleware.push(size({
      apply({rects, elements}) {
        Object.assign(elements.floating.style, {
          minWidth: `${rects.reference.width}px`,
        });
      },
    }))
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
  const [popperElement, attachRef] = useState<ReferenceElement>(null);
  const { floatingStyles } = useFloating({
    elements: {
      floating: popperElement,
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
