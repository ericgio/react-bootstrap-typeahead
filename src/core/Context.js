// @flow

import { pick } from 'lodash';
import createReactContext, { type Context } from 'create-react-context';
import React, { type ComponentType } from 'react';

import type { Id, LabelKey, Option, ReferenceElement, TypeaheadInnerProps } from '../types';

/* istanbul ignore next */
const arrToObj = (keys: string[]) => keys.reduce((obj: Object, k: string) => ({
  ...obj, [k]: undefined,
}), {});

/**
 * $Pick utility
 * https://github.com/facebook/flow/issues/3367
 */
/* eslint-disable flowtype/generic-spacing */
type $Pick<Origin: Object, Keys: $ReadOnlyArray<$Keys<Origin>>> = $ObjMapi<
  $Call<typeof arrToObj, Keys>,
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

export type MenuContextType = {
  id: Id,
  labelKey: LabelKey,
  referenceElement: ?ReferenceElement,
  results: Option[],
  text: string
};

export const MenuContext: Context<MenuContextType> = createReactContext({});

export const withContext = (
  Component: ComponentType<*>,
  values: string[]
) => {
  // Note: Use a class instead of function component to support refs.
  /* eslint-disable-next-line react/prefer-stateless-function */
  return class extends React.Component<*> {
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
