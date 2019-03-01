// @flow

import cx from 'classnames';
import React from 'react';

import hintContainer from '../containers/hintContainer';
import withClassNames from '../containers/withClassNames';

type Props = {
  className?: string,
  inputRef: Function,
};

class TypeaheadInputSingle extends React.Component<Props> {
  render() {
    const { className, inputRef, ...props } = this.props;

    return (
      <input
        {...props}
        className={cx('rbt-input-main', className)}
        ref={inputRef}
      />
    );
  }
}

export default hintContainer(withClassNames(TypeaheadInputSingle));
