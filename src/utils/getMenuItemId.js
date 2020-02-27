// @flow

import type { Id } from '../types';

export default function getMenuItemId(id?: Id, position: number): string {
  return `${id || ''}-item-${position}`;
}
