// @flow

import { type ComponentType } from 'react';

export default function getDisplayName(Component: ComponentType<*>) {
  return Component.displayName || Component.name || 'Component';
}
