// @flow

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import type { BsSize } from '../types';

type Props = {
  bsSize?: BsSize,
};

const Loader = ({ bsSize }: Props) => (
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
