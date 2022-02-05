import type { Size } from '../types';

export function isSizeLarge(size?: Size): boolean {
  return size === 'lg';
}

export function isSizeSmall(size?: Size): boolean {
  return size === 'sm';
}
