import cx from 'classnames';
import React from 'react';

import { getDisplayName } from '../utils';

function withClassNames(Component) {
  // Use a class instead of function component to support refs.
  /* eslint-disable-next-line react/prefer-stateless-function */
  class WrappedComponent extends React.Component {
    static displayName = `withClassNames(${getDisplayName(Component)})`;

    render() {
      const { bsSize, className, isInvalid, isValid, ...props } = this.props;

      return (
        <Component
          {...props}
          className={cx('form-control', 'rbt-input', {
            'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
            'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
            'is-invalid': isInvalid,
            'is-valid': isValid,
          }, className)}
        />
      );
    }
  }

  return WrappedComponent;
}

export default withClassNames;
