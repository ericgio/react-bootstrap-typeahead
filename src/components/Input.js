// @flow

import cx from 'classnames';
import React from 'react';

type Props = {
  className?: string,
};

const Input = React.forwardRef<Props, ?HTMLInputElement>((props, ref) => (
  <input
    {...props}
    className={cx('rbt-input-main', props.className)}
    ref={ref}
  />
));

export default Input;
