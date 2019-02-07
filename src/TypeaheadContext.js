import {noop, pick} from 'lodash';
import createReactContext from 'create-react-context';
import React from 'react';

const TypeaheadContext = createReactContext({
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

export const withContext = (Component, values) => {
  // Note: Use a class instead of function component to support refs.
  /* eslint-disable-next-line react/prefer-stateless-function */
  return class extends React.Component {
    render() {
      return (
        <TypeaheadContext.Consumer>
          {(context) => (
            <Component {...this.props} {...pick(context, values)} />
          )}
        </TypeaheadContext.Consumer>
      );
    }
  };
};

export default TypeaheadContext;
