import {noop, pick} from 'lodash';
import createReactContext from 'create-react-context';
import React from 'react';

const TypeaheadContext =  createReactContext({
  activeIndex: -1,
  hintText: '',
  initialItem: null,
  isOnlyResult: false,
  onActiveItemChange: noop,
  onAdd: noop,
  onInitialItemChange: noop,
  onMenuItemClick: noop,
  selectHintOnEnter: false,
});

export const withContext = (Component, values) => (props) => (
  <TypeaheadContext.Consumer>
    {(context) => <Component {...props} {...pick(context, values)} />}
  </TypeaheadContext.Consumer>
);

export default TypeaheadContext;
