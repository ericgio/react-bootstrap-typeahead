import {pick} from 'lodash';
import React from 'react';

import Overlay from './Overlay';

const TypeaheadMenu = (props) => {
  const {children, isMenuShown, menuId, results} = props;

  const overlayProps = pick(props, [
    'align',
    'dropup',
    'flip',
    'onMenuHide',
    'onMenuShow',
    'onMenuToggle',
    'positionFixed',
    'referenceElement',
  ]);

  const menuProps = pick(props, [
    'emptyLabel',
    'labelKey',
    'maxHeight',
    'newSelectionPrefix',
    'renderMenuItemChildren',
    'text',
  ]);

  menuProps.id = menuId;

  return (
    <Overlay {...overlayProps} show={isMenuShown}>
      {(propsFromOverlay) => children(results, {
        ...propsFromOverlay,
        ...menuProps,
      })}
    </Overlay>
  );
};

export default TypeaheadMenu;
