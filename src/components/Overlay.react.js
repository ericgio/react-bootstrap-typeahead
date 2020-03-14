// @flow

/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Popper, type PopperChildrenProps } from 'react-popper';

import { values } from '../utils';
import { ALIGN } from '../constants';

import type { OverlayProps } from '../types';

// `Element` is not defined during server-side rendering, so shim it here.
/* istanbul ignore next */
const SafeElement = typeof Element === 'undefined' ? () => {} : Element;

const propTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: PropTypes.oneOf(values(ALIGN)),
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
  referenceElement: PropTypes.instanceOf(SafeElement),
};

const defaultProps = {
  align: ALIGN.JUSTIFY,
  dropup: false,
  flip: false,
  isMenuShown: false,
  positionFixed: false,
};

function getModifiers({ align, flip }: OverlayProps) {
  return {
    computeStyles: {
      enabled: true,
      fn: ({ styles, ...data }) => ({
        ...data,
        styles: {
          ...styles,
          // Use the following condition instead of `align === 'justify'`
          // since it allows the component to fall back to justifying the
          // menu width if `align` is undefined.
          width: align !== ALIGN.RIGHT && align !== ALIGN.LEFT ?
            // Set the popper width to match the target width.
            data.offsets.reference.width :
            styles.width,
        },
      }),
    },
    flip: {
      enabled: flip,
    },
    preventOverflow: {
      escapeWithReference: true,
    },
  };
}

// Flow expects a string literal value for `placement`.
const PLACEMENT = {
  bottom: {
    end: 'bottom-end',
    start: 'bottom-start',
  },
  top: {
    end: 'top-end',
    start: 'top-start',
  },
};

export function getPlacement({ align, dropup }: OverlayProps) {
  const x = align === ALIGN.RIGHT ? 'end' : 'start';
  const y = dropup ? 'top' : 'bottom';

  return PLACEMENT[y][x];
}

const Overlay = (props: OverlayProps) => {
  const { children, isMenuShown, positionFixed, referenceElement } = props;

  if (!isMenuShown) {
    return null;
  }

  return (
    <Popper
      modifiers={getModifiers(props)}
      placement={getPlacement(props)}
      positionFixed={positionFixed}
      referenceElement={referenceElement}>
      {({ ref, ...popperProps }: PopperChildrenProps) => children({
        ...popperProps,
        innerRef: ref,
        inputHeight: referenceElement ? referenceElement.offsetHeight : 0,
      })}
    </Popper>
  );
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
