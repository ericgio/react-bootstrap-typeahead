import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { HTMLProps, KeyboardEvent, MouseEvent } from 'react';

import type { Size } from '../../types';
import { isSizeLarge, isSizeSmall } from '../../utils';

import { sizeType } from '../../propTypes';

const propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  size: sizeType,
};

export interface ClearButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  label?: string;
  size?: Size;
}

/**
 * ClearButton
 */
const ClearButton = ({
  className,
  label = 'Clear',
  onClick,
  onKeyDown,
  size,
  ...props
}: ClearButtonProps): JSX.Element => (
  <button
    {...props}
    aria-label={label}
    className={cx(
      'close',
      'btn-close',
      'rbt-close',
      {
        'rbt-close-lg': isSizeLarge(size),
        'rbt-close-sm': isSizeSmall(size),
      },
      className
    )}
    onClick={(e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick && onClick(e);
    }}
    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
      // Prevent browser from navigating back.
      if (e.key === 'Backspace') {
        e.preventDefault();
      }
      onKeyDown && onKeyDown(e);
    }}
    type="button">
    <span aria-hidden="true" className="rbt-close-content">
      &times;
    </span>
    <span className="sr-only visually-hidden">{label}</span>
  </button>
);

ClearButton.propTypes = propTypes;

export default ClearButton;
