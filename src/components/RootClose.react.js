// @flow

import { useState } from 'react';
import { useRootClose } from 'react-overlays';

import type { Node } from 'react';
import type { RefCallback } from '../types';

type Props = {
  children: (RefCallback<mixed>) => Node,
  onRootClose: (SyntheticEvent<HTMLElement>) => void,
};

const RootClose = ({ children, onRootClose, ...props }: Props) => {
  const [rootElement, attachRef] = useState(null);
  useRootClose(rootElement, onRootClose, props);
  return children(attachRef);
};

export default RootClose;
