// @flow

import React from 'react';

import { MenuContext, type MenuContextType } from './Context';
import Overlay from './Overlay';

import type { Id, LabelKey, Option, Style } from '../types';

type MenuPropsFromOverlay = {
  innerRef: (?HTMLElement) => void,
  inputHeight: number,
  scheduleUpdate: Function,
  style: Style,
};

export type MenuProps = MenuPropsFromOverlay & {
  id?: Id,
  labelKey: LabelKey,
  text: string,
};

type Props = {
  children: (Option[], MenuProps) => void,
};

const TypeaheadMenu = ({ children }: Props) => (
  <MenuContext.Consumer>
    {({ id, labelKey, results, text, ...context }: MenuContextType) => (
      <Overlay {...context}>
        {(menuProps: MenuPropsFromOverlay) => children(results, {
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
