// @flow

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import { isSizeLarge, noop } from '../utils';

import { sizeType } from '../propTypes';
import type { EventHandler, KeyboardEventHandler, Size } from '../types';

import { BACKSPACE } from '../constants';

const propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  size: sizeType,
};

const defaultProps = {
  label: 'Clear',
  onClick: noop,
  onKeyDown: noop,
};

type Props = {
  className?: string,
  label: string,
  onClick: EventHandler<HTMLButtonElement>,
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>,
  size?: Size,
};

/**
 * ClearButton
 *
 * http://getbootstrap.com/css/#helper-classes-close
 */
const ClearButton = ({
  className,
  label,
  onClick,
  onKeyDown,
  size,
  ...props
}: Props) => (
  <button
    {...props}
    aria-label={label}
    className={cx(
      'close',
      'rbt-close',
      {
        'rbt-close-lg': isSizeLarge(size),
      },
      className
    )}
    onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e);
    }}
    onKeyDown={(e: SyntheticKeyboardEvent<HTMLButtonElement>) => {
      // Prevent browser from navigating back.
      if (e.keyCode === BACKSPACE) {
        e.preventDefault();
      }
      onKeyDown(e);
    }}
    type="button">
    <span aria-hidden="true">&times;</span>
    <span className="sr-only">{label}</span>
  </button>
);

ClearButton.propTypes = propTypes;
ClearButton.defaultProps = defaultProps;

export default ClearButton;
