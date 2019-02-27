// @flow

import { pick } from 'lodash';
import createReactContext, { type Context } from 'create-react-context';
import * as React from 'react';

import type { TypeaheadInnerProps } from '../types';

const toObject = (keys) => keys.reduce((object, key) => {
  object[key] = undefined; /* eslint-disable-line no-param-reassign */
  return object;
}, {});

/* eslint-disable flowtype/generic-spacing */
type $Pick<Origin: Object, Keys: $ReadOnlyArray<$Keys<Origin>>> = $ObjMapi<
  $Call<typeof toObject, Keys>,
  <Key>(k: Key) => $ElementType<Origin, Key>
>;
/* eslint-enable flowtype/generic-spacing */

export const TypeaheadContextKeys = [
  'activeIndex',
  'id',
  'initialItem',
  'onActiveItemChange',
  'onAdd',
  'onInitialItemChange',
  'onMenuItemClick',
  'selectHintOnEnter',
];

export type TypeaheadContextType =
  $Pick<TypeaheadInnerProps, typeof TypeaheadContextKeys> & {
    hintText: string,
    isOnlyResult: boolean,
  };

export const TypeaheadContext: Context<TypeaheadContextType> =
  createReactContext({});

export const InputContextKeys = [
  'activeIndex',
  'disabled',
  'id',
  'inputProps',
  'inputRef',
  'isFocused',
  'isMenuShown',
  'labelKey',
  'multiple',
  'onBlur',
  'onChange',
  'onFocus',
  'onKeyDown',
  'onRemove',
  'placeholder',
  'selected',
];

export type InputContextType =
  $Pick<TypeaheadInnerProps, typeof InputContextKeys> & {
    ref: Function,
    value: string,
  };

export const InputContext: Context<InputContextType> = createReactContext({});

export const MenuContextKeys = [
  'align',
  'dropup',
  'flip',
  'id',
  'labelKey',
  'onMenuToggle',
  'positionFixed',
  'referenceElement',
  'results',
  'text',
];

export type MenuContextType =
  $Pick<TypeaheadInnerProps, typeof MenuContextKeys> & {
    show: boolean,
  };

export const MenuContext: Context<MenuContextType> = createReactContext({});

export const withContext = (
  Component: React.ComponentType<{}>,
  values: string[]
) => {
  // Note: Use a class instead of function component to support refs.
  /* eslint-disable-next-line react/prefer-stateless-function */
  return class extends React.Component<{}> {
    render() {
      return (
        <TypeaheadContext.Consumer>
          {(context: TypeaheadContextType) => (
            <Component {...this.props} {...pick(context, values)} />
          )}
        </TypeaheadContext.Consumer>
      );
    }
  };
};
