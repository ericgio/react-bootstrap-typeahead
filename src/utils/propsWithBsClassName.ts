import cx from 'classnames';

import { isSizeLarge, isSizeSmall } from './size';
import type { Size } from '../types';

interface Props {
  className?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  size?: Size;
}

/**
 * Returns Bootstrap classnames from `size` and validation props, along
 * with pass-through props.
 */
export default function propsWithBsClassName<T>({
  className,
  isInvalid,
  isValid,
  size,
  ...props
}: Props & T) {
  return {
    ...props,
    className: cx(
      'form-control',
      'rbt-input',
      {
        'form-control-lg': isSizeLarge(size),
        'form-control-sm': isSizeSmall(size),
        'is-invalid': isInvalid,
        'is-valid': isValid,
      },
      className
    ),
  };
}
