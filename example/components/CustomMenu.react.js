import {groupBy, map, pick} from 'lodash';
import React from 'react';

import Menu from '../../src/Menu.react';
import MenuItem from '../../src/MenuItem.react';

const MenuDivider = props => <li className="divider" role="separator" />;
const MenuHeader = props => <li {...props} className="dropdown-header" />;

const CustomMenu = props => {
  let idx = 0;
  const grouped = groupBy(props.results, r => r.region);
  const items = Object.keys(grouped).sort().map(region => {
    return [
      !!idx && <MenuDivider key={`${region}-divider`} />,
      <MenuHeader key={`${region}-header`}>
        {region}
      </MenuHeader>,
      map(grouped[region], state => {
        const item =
          <MenuItem key={idx} option={state} position={idx}>
            {state.name}
          </MenuItem>;

        idx++;
        return item;
      }),
    ];
  });

  const menuProps = pick(props, [
    'align',
    'className',
    'emptyLabel',
    'maxHeight',
    'onPaginate',
    'paginate',
    'paginationText',
    'style',
  ]);

  return (
    <Menu {...menuProps}>
      {items}
    </Menu>
  );
};

export default CustomMenu;
