/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

import cx from 'classnames';
import React, { ComponentType } from 'react';

import { getDisplayName, isSizeLarge, isSizeSmall } from '../utils';
import type { Size } from '../types';

type Props = any & {
  className?: string;
  isInvalid?: boolean;
  isValid?: boolean;
  size?: Size;
};

function withClassNames(Component: ComponentType<Props>) {
  // Use a class instead of function component to support refs.
  class WrappedComponent extends React.Component<Props> {
    static displayName = `withClassNames(${getDisplayName(Component)})`;

    render() {
      const { className, isInvalid, isValid, size, ...props } = this.props;

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
    }
  }

  return WrappedComponent;
}

export default withClassNames;
