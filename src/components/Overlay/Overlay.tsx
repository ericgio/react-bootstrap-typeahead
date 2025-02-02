import { CSSProperties, ReactElement, RefCallback } from 'react';

import { OverlayOptions, ReferenceElement, useOverlay } from '../../hooks';

export interface OverlayRenderProps {
  innerRef: RefCallback<HTMLElement>;
  style: CSSProperties;
}

export interface OverlayProps extends OverlayOptions {
  children: (props: OverlayRenderProps) => ReactElement | null;
  isMenuShown: boolean;
  referenceElement: ReferenceElement;
}

/**
 * The component is mainly for testing purposes.
 */
function Overlay({ referenceElement, isMenuShown, ...props }: OverlayProps) {
  const overlayProps = useOverlay(referenceElement, props);

  if (!isMenuShown) {
    return null;
  }

  return props.children(overlayProps);
}

export default Overlay;
