import type { ModifierArguments, Placement, Options } from '@popperjs/core';
import PropTypes from 'prop-types';
import {
  CSSProperties,
  ReactElement,
  RefCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { usePopper } from 'react-popper';

import { noop } from '../../utils';

const alignValues = ['justify', 'left', 'right'] as const;
export type Align = typeof alignValues[number];

// `Element` is not defined during server-side rendering, so shim it here.
/* istanbul ignore next */
const SafeElement = typeof Element === 'undefined' ? noop : Element;

const propTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: PropTypes.oneOf(alignValues),
  children: PropTypes.func.isRequired,
  /**
   * Specify whether the menu should appear above the input.
   */
  dropup: PropTypes.bool,
  /**
   * Whether or not to automatically adjust the position of the menu when it
   * reaches the viewport boundaries.
   */
  flip: PropTypes.bool,
  isMenuShown: PropTypes.bool,
  positionFixed: PropTypes.bool,
  // @ts-ignore
  referenceElement: PropTypes.instanceOf(SafeElement),
};

const defaultProps = {
  align: 'justify',
  dropup: false,
  flip: false,
  isMenuShown: false,
  positionFixed: false,
};

export interface OverlayRenderProps {
  innerRef: RefCallback<HTMLElement>;
  style: CSSProperties;
}

export interface OverlayProps {
  align: Align;
  children: (props: OverlayRenderProps) => ReactElement | null;
  dropup: boolean;
  flip: boolean;
  isMenuShown: boolean;
  positionFixed: boolean;
  referenceElement: HTMLElement | null;
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

export function getModifiers(props: Pick<OverlayProps, 'align' | 'flip'>) {
  const modifiers = [
    {
      enabled: !!props.flip,
      name: 'flip',
    },
  ];

  if (props.align !== 'right' && props.align !== 'left') {
    modifiers.push(setPopperWidth);
  }

  return modifiers;
}

export function getPlacement(
  props: Pick<OverlayProps, 'align' | 'dropup'>
): Placement {
  const x = props.align === 'right' ? 'end' : 'start';
  const y = props.dropup ? 'top' : 'bottom';

  return `${y}-${x}`;
}

const Overlay = ({ referenceElement, ...props }: OverlayProps) => {
  const [popperElement, attachRef] = useState<HTMLElement | null>(null);
  const { attributes, styles, forceUpdate } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: getModifiers(props),
      placement: getPlacement(props),
      strategy: props.positionFixed ? 'fixed' : 'absolute',
    }
  );

  const refElementHeight = referenceElement?.offsetHeight;

  // Re-position the popper if the height of the reference element changes.
  // Exclude `forceUpdate` from dependencies since it changes with each render.
  useLayoutEffect(() => {
    forceUpdate && forceUpdate();
  }, [refElementHeight]); // eslint-disable-line

  if (!props.isMenuShown) {
    return null;
  }

  return props.children({
    ...attributes.popper,
    innerRef: attachRef,
    style: styles.popper,
  });
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
