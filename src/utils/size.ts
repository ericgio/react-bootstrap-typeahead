import type { Size } from '../types';

export function isSizeLarge(size?: Size): boolean {
  return size === 'large' || size === 'lg';
}

export function isSizeSmall(size?: Size): boolean {
  return size === 'small' || size === 'sm';
}
