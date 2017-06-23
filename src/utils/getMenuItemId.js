// @flow

export default function getMenuItemId(
  id: number | string,
  position: number
): string {
  return `${id}-item-${position}`;
}
