import {head, pick} from 'lodash';
import React from 'react';
import {polyfill} from 'react-lifecycles-compat';

import TypeaheadContext from '../TypeaheadContext';
import {getHintText} from '../utils/';
import {RETURN} from '../constants';

function contextContainer(Typeahead) {
  class WrappedTypeahead extends React.Component {
    state = {
      isOnlyResult: false,
    };

    static getDerivedStateFromProps(props, state) {
      const {allowNew, highlightOnlyResult, results} = props;

      if (!highlightOnlyResult || allowNew) {
        return null;
      }

      return {
        isOnlyResult: results.length === 1 && !head(results).disabled,
      };
    }

    componentDidUpdate(prevProps, prevState) {
      const {allowNew, onInitialItemChange, results} = this.props;

      // Clear the initial item when there are no results.
      if (!(allowNew || results.length)) {
        onInitialItemChange(null);
      }
    }

    render() {
      const contextValues = pick(this.props, [
        'activeIndex',
        'initialItem',
        'onActiveItemChange',
        'onAdd',
        'onInitialItemChange',
        'onMenuItemClick',
        'selectHintOnEnter',
      ]);

      return (
        <TypeaheadContext.Provider
          value={{
            ...contextValues,
            hintText: getHintText(this.props),
            isOnlyResult: this.state.isOnlyResult,
          }}>
          <Typeahead
            {...this.props}
            onKeyDown={this._handleKeyDown}
          />
        </TypeaheadContext.Provider>
      );
    }

    _handleKeyDown = (e) => {
      const {initialItem, onKeyDown, onAdd} = this.props;

      switch (e.keyCode) {
        case RETURN:
          if (this.state.isOnlyResult) {
            onAdd(initialItem);
          }
          break;
      }

      onKeyDown(e);
    }
  }

  polyfill(WrappedTypeahead);

  return WrappedTypeahead;
}

export default contextContainer;
