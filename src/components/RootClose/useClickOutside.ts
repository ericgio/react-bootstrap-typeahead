import { useCallback, useEffect, useRef } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';

import { noop, warn } from '../../utils';

export type MouseEvents = {
  [K in keyof GlobalEventHandlersEventMap]: GlobalEventHandlersEventMap[K] extends MouseEvent
    ? K
    : never;
}[keyof GlobalEventHandlersEventMap];

function isLeftClickEvent(event: MouseEvent) {
  return event.button === 0;
}

function isModifiedEvent(event: MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export interface ClickOutsideOptions {
  disabled?: boolean;
  clickTrigger?: MouseEvents;
}

const InitialTriggerEvents: Partial<Record<MouseEvents, MouseEvents>> = {
  click: 'mousedown',
  mouseup: 'mousedown',
  pointerup: 'pointerdown',
};

/**
 * The `useClickOutside` hook registers your callback on the document that fires
 * when a pointer event is registered outside of the provided ref or element.
 */
function useClickOutside(
  ref: React.RefObject<Element>,
  onClickOutside: (e: MouseEvent) => void = noop,
  { disabled, clickTrigger = 'click' }: ClickOutsideOptions = {}
) {
  const preventMouseClickOutsideRef = useRef(false);
  const waitingForTrigger = useRef(false);

  const handleMouseCapture = useCallback(
    (e: MouseEvent) => {
      const currentTarget = ref.current;

      warn(
        !!currentTarget,
        'ClickOutside captured a close event but does not have a ref to compare it to. ' +
          'useClickOutside(), should be passed a ref that resolves to a DOM node'
      );

      preventMouseClickOutsideRef.current =
        !currentTarget ||
        isModifiedEvent(e) ||
        !isLeftClickEvent(e) ||
        !!currentTarget.contains(e.target as Node) ||
        waitingForTrigger.current;

      waitingForTrigger.current = false;
    },
    [ref]
  );

  const handleInitialMouse = useEventCallback((e: MouseEvent) => {
    const currentTarget = ref.current;

    if (currentTarget?.contains(e.target as Node)) {
      waitingForTrigger.current = true;
    } else {
      // When clicking on scrollbars within current target, click events are not
      // triggered, so this ref is never reset inside `handleMouseCapture`. This
      // would cause a bug where it requires 2 clicks to close the overlay.
      waitingForTrigger.current = false;
    }
  });

  const handleMouse = useEventCallback((e: MouseEvent) => {
    if (!preventMouseClickOutsideRef.current) {
      onClickOutside(e);
    }
  });

  useEffect(() => {
    if (disabled || ref == null) return undefined;

    const doc = ref.current?.ownerDocument || document;
    const ownerWindow = doc.defaultView || window;

    // Store the current event to avoid triggering handlers immediately
    // For things rendered in an iframe, the event might originate on the parent window
    // so we should fall back to that global event if the local one doesn't exist
    // https://github.com/facebook/react/issues/20074
    let currentEvent = ownerWindow.event ?? ownerWindow.parent?.event;

    let removeInitialTriggerListener: (() => void) | null = null;
    if (InitialTriggerEvents[clickTrigger]) {
      doc.addEventListener(
        InitialTriggerEvents[clickTrigger]!,
        handleInitialMouse,
        true
      );

      removeInitialTriggerListener = () => {
        doc.removeEventListener(
          InitialTriggerEvents[clickTrigger]!,
          handleInitialMouse
        );
      };
    }

    const handleMouseTrigger = (e: MouseEvent) => {
      // skip if this event is the same as the one running when we added the handlers
      if (e === currentEvent) {
        currentEvent = undefined;
        return;
      }
      handleMouse(e);
    };

    // Use capture for this listener so it fires before React's listener, to
    // avoid false positives in the contains() check below if the target DOM
    // element is removed in the React mouse callback.
    doc.addEventListener(clickTrigger, handleMouseCapture, true);
    doc.addEventListener(clickTrigger, handleMouseTrigger, true);

    return () => {
      removeInitialTriggerListener?.();
      doc.removeEventListener(clickTrigger, handleMouseCapture);
      doc.removeEventListener(clickTrigger, handleMouseTrigger);
    };
  }, [
    ref,
    disabled,
    clickTrigger,
    handleMouseCapture,
    handleInitialMouse,
    handleMouse,
  ]);
}

export default useClickOutside;
