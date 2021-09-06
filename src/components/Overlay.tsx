import type { Data, Placement } from 'popper.js';
import PropTypes from 'prop-types';
import React, { CSSProperties, ReactNode, Ref } from 'react';
import { Popper, PopperProps } from 'react-popper';

import { noop } from '../utils';

export enum Align {
  JUSTIFY = 'justify',
  LEFT = 'left',
  RIGHT = 'right',
}

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
  align: PropTypes.oneOf(Object.values(Align)),
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
  align: Align.JUSTIFY,
  dropup: false,
  flip: false,
  isMenuShown: false,
  positionFixed: false,
};

export interface OverlayRenderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  innerRef: Ref<any>;
  inputHeight: number;
  scheduleUpdate: () => void;
  style: CSSProperties;
}

export interface OverlayProps {
  align: Align;
  children: (props: OverlayRenderProps) => ReactNode;
  dropup: boolean;
  flip: boolean;
  isMenuShown: boolean;
  positionFixed: boolean;
  referenceElement?: HTMLElement;
}

function getModifiers(props: OverlayProps): PopperProps['modifiers'] {
  return {
    computeStyles: {
      enabled: true,
      fn: (data: Data) => {
        return {
          ...data,
          styles: {
            ...data.styles,
            // Use the following condition instead of `align === 'justify'`
            // since it allows the component to fall back to justifying the
            // menu width if `align` is undefined.
            width:
              props.align !== Align.RIGHT && props.align !== Align.LEFT
                ? // Set the popper width to match the target width.
                  `${data.offsets.reference.width}px`
                : data.styles.width,
          },
        };
      },
    },
    flip: {
      enabled: props.flip,
    },
    preventOverflow: {
      escapeWithReference: true,
    },
  };
}

export function getPlacement(
  props: Pick<OverlayProps, 'align' | 'dropup'>
): Placement {
  const x = props.align === Align.RIGHT ? 'end' : 'start';
  const y = props.dropup ? 'top' : 'bottom';

  return `${y}-${x}`;
}

const Overlay = ({ referenceElement, ...props }: OverlayProps) => {
  if (!props.isMenuShown) {
    return null;
  }

  return (
    <Popper
      modifiers={getModifiers(props)}
      placement={getPlacement(props)}
      positionFixed={props.positionFixed}
      referenceElement={referenceElement}>
      {({ ref, ...popperProps }) =>
        props.children({
          ...popperProps,
          innerRef: ref,
          inputHeight: referenceElement ? referenceElement.offsetHeight : 0,
        })
      }
    </Popper>
  );
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
