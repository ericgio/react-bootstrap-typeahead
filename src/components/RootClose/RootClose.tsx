import { Ref } from 'react';
import useRootClose from './useRootClose';

interface RootCloseProps {
  children: (ref: Ref<HTMLDivElement>) => JSX.Element;
  disabled?: boolean;
  onRootClose: (event: Event) => void;
}

function RootClose({ children, onRootClose, ...props }: RootCloseProps) {
  const rootRef = useRootClose(onRootClose, props);
  return children(rootRef);
}

export default RootClose;
