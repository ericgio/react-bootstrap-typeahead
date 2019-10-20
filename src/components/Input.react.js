// @flow

import cx from 'classnames';
import React from 'react';

import type { InputRefHandler } from '../types';

type Props = {
  className?: string,
  inputRef?: InputRefHandler,
};

class Input extends React.Component<Props> {
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

export default Input;
