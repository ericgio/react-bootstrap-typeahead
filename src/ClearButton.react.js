import cx from 'classnames';
import React from 'react';

/**
 * CloseButton
 *
 * http://getbootstrap.com/css/#helper-classes-close
 */
const ClearButton = ({bsSize, className, onClick}) => (
  <button
    aria-label="Close"
    className={cx('close', {
      'close-lg': bsSize === 'large' || bsSize === 'lg',
    }, className)}
    onClick={onClick}
    type="button">
    <span aria-hidden="true">&times;</span>
    <span className="sr-only">Close</span>
  </button>
);

ClearButton.displayName = 'ClearButton';
ClearButton.propTypes = {
  bsSize: React.PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
};

export default ClearButton;
