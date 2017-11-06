import cx from 'classnames';
import * as React from 'react';
import PropTypes from 'prop-types';

const Loader = ({bsSize}) => (
  <div
    className={cx('rbt-loader', {
      'rbt-loader-lg': bsSize === 'large' || bsSize === 'lg',
      'rbt-loader-sm': bsSize === 'small' || bsSize === 'sm',
    })}
  />
);

Loader.propTypes = {
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
};

export default Loader;
