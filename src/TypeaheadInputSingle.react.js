import cx from 'classnames';
import React from 'react';

import hintContainer from './containers/hintContainer';
import inputContainer from './containers/inputContainer';

class TypeaheadInputSingle extends React.Component {
  render() {
    const {className, inputRef, ...props} = this.props;

    return (
      <input
        {...props}
        className={cx('rbt-input-main', 'form-control', className)}
        ref={inputRef}
      />
    );
  }
}

export default inputContainer(hintContainer(TypeaheadInputSingle));
