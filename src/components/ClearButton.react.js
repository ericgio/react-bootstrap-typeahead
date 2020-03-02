// @flow

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import { isSizeLarge, noop } from '../utils';

import { sizeType } from '../propTypes';
import type { EventHandler, Size } from '../types';

const propTypes = {
  bsSize: sizeType,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  label: 'Clear',
  onClick: noop,
};

type Props = {
  bsSize?: Size,
  className?: string,
  label: string,
  onClick: EventHandler,
};

/**
 * ClearButton
 *
 * http://getbootstrap.com/css/#helper-classes-close
 */
const ClearButton = ({
  bsSize,
  className,
  label,
  onClick,
  ...props
}: Props) => (
  <button
    {...props}
    aria-label={label}
    className={cx('close', 'rbt-close', {
      'rbt-close-lg': isSizeLarge(bsSize),
    }, className)}
    onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e);
    }}
    type="button">
    <span aria-hidden="true">&times;</span>
    <span className="sr-only">{label}</span>
  </button>
);

ClearButton.propTypes = propTypes;
ClearButton.defaultProps = defaultProps;

export default ClearButton;
