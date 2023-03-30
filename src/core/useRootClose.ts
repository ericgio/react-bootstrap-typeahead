import { useEffect, useRef } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';

import useClickOutside, { ClickOutsideOptions } from './useClickOutside';
import { noop } from '../utils';

function useRootClose(
  onRootClose: (e: Event) => void,
  options: ClickOutsideOptions
) {
  const ref = useRef<HTMLDivElement>(null);

  const onClose = onRootClose || noop;

  useClickOutside(ref, onClose, options);

  const handleKeyUp = useEventCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose(e);
    }
  });

  useEffect(() => {
    if (options.disabled || ref == null) return undefined;

    const doc = ref.current?.ownerDocument || document;

    // Store the current event to avoid triggering handlers immediately
    // https://github.com/facebook/react/issues/20074
    let currentEvent = (doc.defaultView || window).event;

    const onKeyUp = (e: KeyboardEvent) => {
      // skip if this event is the same as the one running when we added the handlers
      if (e === currentEvent) {
        currentEvent = undefined;
        return;
      }
      handleKeyUp(e);
    };

    doc.addEventListener('keyup', onKeyUp);

    return () => {
      doc.removeEventListener('keyup', onKeyUp);
    };
  }, [ref, options.disabled, handleKeyUp]);

  return ref;
}

export default useRootClose;
