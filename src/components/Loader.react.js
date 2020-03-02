// @flow

import cx from 'classnames';
import React from 'react';

import { isSizeLarge, isSizeSmall } from '../utils';

import { sizeType } from '../propTypes';
import type { Size } from '../types';

type Props = {
  bsSize?: Size,
};

const Loader = ({ bsSize }: Props) => (
  <div
    className={cx('rbt-loader', {
      'rbt-loader-lg': isSizeLarge(bsSize),
      'rbt-loader-sm': isSizeSmall(bsSize),
    })}
  />
);

Loader.propTypes = {
  bsSize: sizeType,
};

export default Loader;
