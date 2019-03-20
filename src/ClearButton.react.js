import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {mapClassNamesToCssModules} from './utils';

/**
 * ClearButton
 *
 * http://getbootstrap.com/css/#helper-classes-close
 */
const ClearButton = ({
  bsSize,
  cssModules,
  className,
  label,
  onClick,
  ...props
}) => {
  const classNames = cx('close', 'rbt-close', {
    'rbt-close-lg': bsSize === 'large' || bsSize === 'lg',
  }, className);
  return (
    <button
      {...props}
      aria-label={label}
      className={mapClassNamesToCssModules(classNames, cssModules)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      type="button">
      <span aria-hidden="true">&times;</span>
      <span className="sr-only">{label}</span>
    </button>
  );
};

ClearButton.propTypes = {
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
  cssModules: PropTypes.object,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ClearButton.defaultProps = {
  label: 'Clear',
};

export default ClearButton;
