import {head} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {RETURN} from '../constants/keyCode';

function highlightOnlyResultContainer(Typeahead) {
  class WrappedTypeahead extends React.Component {
    state = {
      isOnlyResult: false,
    };

    componentWillReceiveProps(nextProps) {
      const {allowNew, highlightOnlyResult, results} = nextProps;

      if (!highlightOnlyResult || allowNew) {
        return;
      }

      if (results.length !== this.props.results.length) {
        this.setState({
          isOnlyResult: results.length === 1 && !head(results).disabled,
        });
      }
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
      const {initialItem, onKeyDown, onSelectionAdd} = this.props;

      switch (e.keyCode) {
        case RETURN:
          if (this.state.isOnlyResult) {
            onSelectionAdd(initialItem);
          }
          break;
      }

      onKeyDown(e);
    }
  }

  WrappedTypeahead.childContextTypes = {
    isOnlyResult: PropTypes.bool.isRequired,
  };

  return WrappedTypeahead;
}

export default highlightOnlyResultContainer;
