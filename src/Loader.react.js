import cx from 'classnames';
import React from 'react';

const Loader = ({bsSize}) => (
  <div
    className={cx('bootstrap-typeahead-loader', {
      'loader-lg': bsSize === 'large' || bsSize === 'lg',
      'loader-sm': bsSize === 'small' || bsSize === 'sm',
    })}
  />
);

export default Loader;
