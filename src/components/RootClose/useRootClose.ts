import { useRef } from 'react';
import _useRootClose, { RootCloseOptions } from '@restart/ui/useRootClose';

function useRootClose(
  onRootClose: (e: Event) => void,
  options: RootCloseOptions
) {
  const ref = useRef<HTMLDivElement>(null);
  _useRootClose(ref, onRootClose, options);
  return ref;
}

export default useRootClose;
