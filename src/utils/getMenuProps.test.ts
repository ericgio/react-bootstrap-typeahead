import getMenuProps from './getMenuProps';

const baseMenuProps = {
  id: 'menu-id',
};

describe('getMenuProps', () => {
  it('generates default menu props', () => {
    const menuProps = getMenuProps(baseMenuProps)();

    expect(menuProps).toEqual({
      'aria-label': 'menu-options',
      id: 'menu-id',
      role: 'listbox',
    });
  });

  it('generates menu props with user-defined values', () => {
    const label = 'different-label';
    const userMenuProps = {
      'aria-label': label,
      className: 'some-classname',
      role: 'menu',
    };

    const menuProps = getMenuProps(baseMenuProps)(userMenuProps);

    expect(menuProps).toEqual({
      ...userMenuProps,
      id: 'menu-id',
      role: 'listbox',
    });
  });
});
