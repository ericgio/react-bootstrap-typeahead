// @flow

/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import type { ReferenceElement } from '../types';

export type OverlayProps = {
  align: 'justify' | 'left' | 'right',
  children: Function,
  dropup: boolean,
  flip: boolean,
  isMenuShown: boolean,
  positionFixed: boolean,
  referenceElement: ?ReferenceElement,
};

const propTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: PropTypes.oneOf(['justify', 'left', 'right']),
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
  referenceElement: PropTypes.instanceOf(Element),
};

const defaultProps = {
  align: 'justify',
  dropup: false,
  flip: false,
  isMenuShown: false,
  positionFixed: false,
};

function getModifiers({ align, flip }: OverlayProps) {
  return {
    computeStyles: {
      enabled: true,
      fn: (data) => {
        // Use the following condition instead of `align === 'justify'` since
        // it allows the component to fall back to justifying the menu width
        // even when `align` is undefined.
        if (align !== 'right' && align !== 'left') {
          // Set the popper width to match the target width.
          /* eslint-disable no-param-reassign */
          // $FlowFixMe: Flow expects string but gets number from Popper.js
          data.styles.width = data.offsets.reference.width;
          /* eslint-enable no-param-reassign */
        }

        return data;
      },
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
  const x = align === 'right' ? 'end' : 'start';
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
      {({ ref, ...popperProps }) => children({
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
