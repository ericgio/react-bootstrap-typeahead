import { useRef } from 'react';
import _useRootClose, { RootCloseOptions } from 'react-overlays/useRootClose';

function useRootClose(
  onRootClose: (e: Event) => void,
  options: RootCloseOptions
) {
  const rootElementRef = useRef<HTMLDivElement>(null);
  _useRootClose(rootElementRef.current, onRootClose, options);
  return rootElementRef;
}

export default useRootClose;
