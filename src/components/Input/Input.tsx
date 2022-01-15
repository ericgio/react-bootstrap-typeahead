import cx from 'classnames';
import React, { forwardRef, HTMLAttributes } from 'react';

export type InputProps = HTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input
    {...props}
    className={cx('rbt-input-main', props.className)}
    ref={ref}
  />
));

export default Input;
