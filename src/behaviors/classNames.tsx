/* eslint-disable @typescript-eslint/no-explicit-any */

import cx from 'classnames';
import React, { ComponentType } from 'react';

import { getDisplayName, isSizeLarge, isSizeSmall } from '../utils';
import { Size } from '../constants';

type Props = any & {
  className?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  size?: Size;
};

function withClassNames(Component: ComponentType<Props>) {
  const WrappedComponent = ({
    className,
    isInvalid,
    isValid,
    size,
    ...props
  }: Props) => {
    return (
      <Component
        {...props}
        className={cx(
          'form-control',
          'rbt-input',
          {
            'form-control-lg': isSizeLarge(size),
            'form-control-sm': isSizeSmall(size),
            'is-invalid': isInvalid,
            'is-valid': isValid,
          },
          className
        )}
      />
    );
  };

  WrappedComponent.displayName = `withClassNames(${getDisplayName(Component)})`;

  return WrappedComponent;
}

export default withClassNames;
