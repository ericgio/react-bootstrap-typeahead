import { CSSProperties, useEffect, useState } from 'react';
import usePopper, {
  Placement,
  Options,
  State,
  Instance,
} from '@restart/ui/usePopper';

import { Align } from '../../types';

interface ModifierArguments<Options> {
  state: State;
  instance: Instance;
  options: Partial<Options>;
  name: string;
}

const setPopperWidth = {
  enabled: true,
  fn: (data: ModifierArguments<Options>) => {
    // eslint-disable-next-line no-param-reassign
    data.state.styles.popper.width = `${data.state.rects.reference.width}px`;
  },
  name: 'setPopperWidth',
  phase: 'write',
};

export type ReferenceElement = HTMLElement | null;

export interface OverlayOptions {
  align?: Align;
  dropup?: boolean;
  flip?: boolean;
  positionFixed?: boolean;
}

export function getModifiers(props: Pick<OverlayOptions, 'align' | 'flip'>) {
  const modifiers = [
    {
      enabled: !!props.flip,
      name: 'flip',
    },
    {
      name: 'preventOverflow',
      options: {
        mainAxis: false,
      },
    },
  ];

  if (props.align !== 'right' && props.align !== 'left') {
    modifiers.push(setPopperWidth);
  }

  return modifiers;
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
  const [popperElement, attachRef] = useState<HTMLElement | null>(null);
  const { attributes, styles, forceUpdate } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: getModifiers(options),
      placement: getPlacement(options),
      strategy: options.positionFixed ? 'fixed' : 'absolute',
    }
  );

  const refElementHeight = referenceElement?.offsetHeight;

  // Re-position the popper if the height of the reference element changes.
  // Exclude `forceUpdate` from dependencies since it changes with each render.
  useEffect(() => {
    forceUpdate();
  }, [refElementHeight]); // eslint-disable-line

  // Re-calculate popper position when using the 'fixed' strategy.
  useEffect(() => {
    if (options.positionFixed && popperElement) {
      forceUpdate();
    }
  }, [options.positionFixed, popperElement]); // eslint-disable-line

  return {
    ...attributes.popper,
    innerRef: attachRef,
    style: styles.popper as CSSProperties,
  };
}

export default useOverlay;
