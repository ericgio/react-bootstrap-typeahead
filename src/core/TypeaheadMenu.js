import React from 'react';

import { MenuContext } from './Context';
import Overlay from './Overlay';

const TypeaheadMenu = ({ children }) => (
  <MenuContext.Consumer>
    {({ id, labelKey, results, text, ...context }) => (
      <Overlay {...context}>
        {(menuProps) => children(results, {
          ...menuProps,
          id,
          labelKey,
          text,
        })}
      </Overlay>
    )}
  </MenuContext.Consumer>
);

export default TypeaheadMenu;
