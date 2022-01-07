import cx from 'classnames';
import PropTypes from 'prop-types';
import React, {
  HTMLProps,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
} from 'react';

import type { Size } from '../types';
import { isSizeLarge, noop } from '../utils';
import { sizeType } from '../propTypes';

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

interface ClearButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  label?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  size?: Size;
}

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
}: ClearButtonProps): JSX.Element => (
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
    onClick={(e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e);
    }}
    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
      // Prevent browser from navigating back.
      if (e.key === 'Backspace') {
        e.preventDefault();
      }
      onKeyDown(e);
    }}
    type="button">
    <span aria-hidden="true">&times;</span>
    <span className="sr-only visually-hidden">{label}</span>
  </button>
);

ClearButton.propTypes = propTypes;
ClearButton.defaultProps = defaultProps;

export default ClearButton;
