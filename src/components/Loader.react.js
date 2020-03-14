// @flow

import cx from 'classnames';
import React from 'react';

import { isSizeLarge, isSizeSmall } from '../utils';

import { sizeType } from '../propTypes';
import type { Size } from '../types';

type Props = {
  size?: Size,
};

const Loader = ({ size }: Props) => (
  <div
    className={cx('rbt-loader', {
      'rbt-loader-lg': isSizeLarge(size),
      'rbt-loader-sm': isSizeSmall(size),
    })}
  />
);

Loader.propTypes = {
  size: sizeType,
};

export default Loader;
