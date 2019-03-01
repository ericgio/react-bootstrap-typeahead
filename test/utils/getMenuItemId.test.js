import { getMenuItemId } from '../../src/utils';

describe('getMenuItemId', () => {
  test('generates an id', () => {
    expect(getMenuItemId('menu-id', 0)).toBe('menu-id-item-0');
  });
});
