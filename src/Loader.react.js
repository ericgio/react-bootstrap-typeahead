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

Loader.propTypes = {
  bsSize: React.PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
};

export default Loader;
