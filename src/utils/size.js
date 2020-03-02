// @flow

export function isSizeLarge(size?: string): boolean {
  return size === 'large' || size === 'lg';
}

export function isSizeSmall(size?: string): boolean {
  return size === 'small' || size === 'sm';
}
