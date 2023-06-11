import PropTypes from 'prop-types';
import { CSSProperties, ReactElement, RefCallback } from 'react';

import useOverlay, { OverlayOptions, ReferenceElement } from './useOverlay';

import { ALIGN_VALUES } from '../../constants';
import { noop } from '../../utils';

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
  align: PropTypes.oneOf(ALIGN_VALUES),
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

export interface OverlayRenderProps {
  innerRef: RefCallback<HTMLElement>;
  style: CSSProperties;
}

export interface OverlayProps extends OverlayOptions {
  children: (props: OverlayRenderProps) => ReactElement | null;
  isMenuShown: boolean;
  referenceElement: ReferenceElement;
}

const Overlay = ({ referenceElement, isMenuShown, ...props }: OverlayProps) => {
  const overlayProps = useOverlay(referenceElement, props);

  if (!isMenuShown) {
    return null;
  }

  return props.children(overlayProps);
};

Overlay.propTypes = propTypes;

export default Overlay;
