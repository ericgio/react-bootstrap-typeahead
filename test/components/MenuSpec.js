import {expect} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import Menu from '../../src/Menu';
import MenuItem, {BaseMenuItem} from '../../src/MenuItem';

describe('<Menu>', () => {
  let menu;

  beforeEach(() => {
    const options = [
      {label: 'Item 1'},
      {label: 'Item 2'},
      {label: 'Item 3'},
    ];

    menu = shallow(
      <Menu id="menu-id" paginate={false}>
        {options.map((o, idx) => (
          <MenuItem
            key={idx}
            option={o}
            position={idx}>
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    );
  });

  it('renders a basic menu with menu items', () => {
    expect(menu.hasClass('rbt-menu')).to.equal(true);
    expect(menu.children().length).to.equal(3);
  });

  it('changes the menu alignment', () => {
    expect(menu.hasClass('dropdown-menu-justify')).to.equal(true);
    expect(menu.hasClass('dropdown-menu-right')).to.equal(false);

    menu.setProps({align: 'right'});
    expect(menu.hasClass('dropdown-menu-justify')).to.equal(false);
    expect(menu.hasClass('dropdown-menu-right')).to.equal(true);

    menu.setProps({align: 'left'});
    expect(menu.hasClass('dropdown-menu-justify')).to.equal(false);
    expect(menu.hasClass('dropdown-menu-right')).to.equal(false);
  });

  it('sets the maxHeight and other styles', () => {
    let maxHeight = '100px';

    function getAttribute(wrapper, attribute) {
      return wrapper.prop('style')[attribute];
    }

    menu.setProps({
      maxHeight,
      style: {backgroundColor: 'red'},
    });

    expect(getAttribute(menu, 'backgroundColor')).to.equal('red');
    expect(getAttribute(menu, 'maxHeight')).to.equal(maxHeight);

    maxHeight = '75%';
    menu.setProps({maxHeight});
    expect(getAttribute(menu, 'maxHeight')).to.equal(maxHeight);
  });

  it('renders an empty label when there are no children', () => {
    const emptyLabel = 'No matches.';
    menu.setProps({
      children: undefined,
      emptyLabel,
    });

    expect(menu.children().length).to.equal(1);

    const emptyLabelItem = menu.find(BaseMenuItem);
    expect(emptyLabelItem.length).to.equal(1);
    expect(emptyLabelItem.prop('disabled')).to.equal(true);

    // See: http://airbnb.io/enzyme/docs/api/ShallowWrapper/dive.html
    expect(emptyLabelItem.dive().text()).to.equal(emptyLabel);
  });

  it('renders a menu item for pagination', () => {
    const onPaginate = sinon.spy();
    const paginationText = 'More...';

    menu.setProps({
      onPaginate,
      paginate: true,
      paginationText,
    });

    const paginationItem = menu.find(BaseMenuItem);

    // 3 menu items + a divider and the pagination item.
    expect(menu.children().length).to.equal(5);
    expect(paginationItem.hasClass('rbt-menu-paginator')).to.equal(true);
    expect(paginationItem.dive().text()).to.equal(paginationText);

    paginationItem.simulate('click');
    expect(onPaginate.calledOnce).to.equal(true);
  });
});
