// @flow

import createReactContext, { type Context } from 'create-react-context';
import React, { type ComponentType } from 'react';

import { pick } from '../utils';

import type { Id, Option, OptionHandler } from '../types';

export type TypeaheadContextType = {
  activeIndex: number,
  hintText: string,
  isOnlyResult: boolean,
  id: Id,
  initialItem: ?Option,
  onActiveItemChange: OptionHandler,
  onAdd: OptionHandler,
  onInitialItemChange: (?Option) => void,
  onMenuItemClick: (Option, SyntheticEvent<HTMLElement>) => void,
  selectHintOnEnter: boolean,
};

export const TypeaheadContext: Context<TypeaheadContextType> =
  createReactContext({});

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
