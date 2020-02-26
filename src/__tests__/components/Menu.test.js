import { shallow } from 'enzyme';
import React from 'react';

import Menu from '../../components/Menu.react';
import MenuItem, { BaseMenuItem } from '../../components/MenuItem.react';

describe('<Menu>', () => {
  let menu;

  beforeEach(() => {
    const options = [
      { label: 'Item 1' },
      { label: 'Item 2' },
      { label: 'Item 3' },
    ];

    menu = shallow(
      <Menu id="menu-id" paginate={false}>
        {options.map((o, idx) => (
          <MenuItem
            key={o.label}
            option={o}
            position={idx}>
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    );
  });

  test('renders a basic menu with menu items', () => {
    expect(menu.hasClass('rbt-menu dropdown-menu')).toBe(true);
    expect(menu.children().length).toBe(3);
  });

  test('sets the maxHeight and other styles', () => {
    let maxHeight = '100px';

    function getAttribute(wrapper, attribute) {
      return wrapper.prop('style')[attribute];
    }

    menu.setProps({
      maxHeight,
      style: { backgroundColor: 'red' },
    });

    expect(getAttribute(menu, 'backgroundColor')).toBe('red');
    expect(getAttribute(menu, 'maxHeight')).toBe(maxHeight);

    maxHeight = '75%';
    menu.setProps({ maxHeight });
    expect(getAttribute(menu, 'maxHeight')).toBe(maxHeight);
  });

  test('renders an empty label when there are no children', () => {
    const emptyLabel = 'No matches.';

    menu.setProps({
      children: undefined,
      emptyLabel,
    });

    expect(menu.children().length).toBe(1);

    const emptyLabelItem = menu.find(BaseMenuItem);
    expect(emptyLabelItem.length).toBe(1);
    expect(emptyLabelItem.prop('disabled')).toBe(true);
    expect(emptyLabelItem.prop('role')).toBe('option');

    // See: http://airbnb.io/enzyme/docs/api/ShallowWrapper/dive.html
    expect(emptyLabelItem.dive().text()).toBe(emptyLabel);
  });

  test('adds an aria-label attribute to the menu', () => {
    expect(menu.prop('aria-label')).toBe('menu-options');

    menu.setProps({ 'aria-label': 'custom-label' });

    expect(menu.prop('aria-label')).toBe('custom-label');
  });

  test('updates the menu position if the input height changes', () => {
    const scheduleUpdate = jest.fn();

    menu.setProps({
      inputHeight: 1,
      scheduleUpdate,
    });

    expect(scheduleUpdate).toHaveBeenCalledTimes(1);
  });

  test('<Menu.Divider>', () => {
    const wrapper = shallow(<Menu.Divider />);

    expect(wrapper.type()).toBe('li');
    expect(wrapper.hasClass('divider dropdown-divider')).toBe(true);
    expect(wrapper.prop('role')).toBe('separator');
  });

  test('<Menu.Header>', () => {
    const children = 'This is a menu header';

    const wrapper = shallow(
      <Menu.Header>
        {children}
      </Menu.Header>
    );

    expect(wrapper.type()).toBe('li');
    expect(wrapper.hasClass('dropdown-header')).toBe(true);
    expect(wrapper.text()).toBe(children);
  });
});
