import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * ClearButton
 *
 * http://getbootstrap.com/css/#helper-classes-close
 */
const ClearButton = ({ bsSize, className, label, onClick, ...props }) => (
  <button
    {...props}
    aria-label={label}
    className={cx('close', 'rbt-close', {
      'rbt-close-lg': bsSize === 'large' || bsSize === 'lg',
    }, className)}
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    type="button">
    <span aria-hidden="true">&times;</span>
    <span className="sr-only">{label}</span>
  </button>
);

ClearButton.propTypes = {
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ClearButton.defaultProps = {
  label: 'Clear',
};

export default ClearButton;
