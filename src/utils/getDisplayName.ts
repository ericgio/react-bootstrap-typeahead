import { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getDisplayName(Component: ComponentType<any>): string {
  return Component.displayName || Component.name || 'Component';
}
