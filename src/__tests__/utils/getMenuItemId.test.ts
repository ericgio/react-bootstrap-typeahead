import { getMenuItemId } from '../../utils';

describe('getMenuItemId', () => {
  it('generates an id', () => {
    expect(getMenuItemId('menu-id', 0)).toBe('menu-id-item-0');
  });
});
