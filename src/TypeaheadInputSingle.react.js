import cx from 'classnames';
import React from 'react';

import hintContainer from './containers/hintContainer';

class TypeaheadInputSingle extends React.Component {
  render() {
    const { className, inputRef, ...props } = this.props;

    return (
      <input
        {...props}
        className={cx('rbt-input-main', 'form-control', className)}
        ref={inputRef}
      />
    );
  }
}

export default hintContainer(TypeaheadInputSingle);
