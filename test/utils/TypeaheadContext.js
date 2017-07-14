import {noop} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

class TypeaheadContext extends React.Component {
  getChildContext() {
    const {activeIndex, isOnlyResult} = this.props;
    return {
      activeIndex: activeIndex != null ? activeIndex : -1,
      isOnlyResult: !!isOnlyResult,
      onActiveItemChange: noop,
      onInitialItemChange: noop,
      onMenuItemClick: noop,
    };
  }

  render() {
    return this.props.children;
  }
}

TypeaheadContext.childContextTypes = {
  activeIndex: PropTypes.number.isRequired,
  isOnlyResult: PropTypes.bool.isRequired,
  onActiveItemChange: PropTypes.func.isRequired,
  onInitialItemChange: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

export default TypeaheadContext;
