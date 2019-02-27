// @flow

import React from 'react';

import { MenuContext } from './Context';
import Overlay from './Overlay';

type Props = {
  children: Function,
};

const TypeaheadMenu = ({ children }: Props) => (
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
