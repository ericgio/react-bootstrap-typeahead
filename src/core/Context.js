// @flow

import React, { createContext } from 'react';
import type { ComponentType, Context } from 'react';

import { pick } from '../utils';

import type { Id, Option, OptionHandler } from '../types';

export type TypeaheadContextType = {
  activeIndex: number,
  hintText: string,
  isOnlyResult: boolean,
  id: Id,
  initialItem: ?Option,
  inputNode: ?HTMLInputElement,
  onActiveItemChange: OptionHandler,
  onAdd: OptionHandler,
  onInitialItemChange: (?Option) => void,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  selectHintOnEnter: boolean,
};

export const TypeaheadContext: Context<TypeaheadContextType> =
  createContext({});

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
