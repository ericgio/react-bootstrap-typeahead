import {head} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {polyfill} from 'react-lifecycles-compat';

import {RETURN} from '../constants/keyCode';

function highlightOnlyResultContainer(Typeahead) {
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

    getChildContext() {
      return {
        isOnlyResult: this.state.isOnlyResult,
      };
    }

    render() {
      return (
        <Typeahead
          {...this.props}
          onKeyDown={this._handleKeyDown}
        />
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

  WrappedTypeahead.childContextTypes = {
    isOnlyResult: PropTypes.bool.isRequired,
  };

  polyfill(WrappedTypeahead);

  return WrappedTypeahead;
}

export default highlightOnlyResultContainer;
