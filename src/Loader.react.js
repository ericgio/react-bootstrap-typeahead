import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {mapClassNamesToCssModules} from './utils';

const Loader = ({bsSize, cssModules}) => {
  const classNames = cx('rbt-loader', {
    'rbt-loader-lg': bsSize === 'large' || bsSize === 'lg',
    'rbt-loader-sm': bsSize === 'small' || bsSize === 'sm',
  });
  return (
    <div className={mapClassNamesToCssModules(classNames, cssModules)} />
  );
};

Loader.propTypes = {
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
  cssModules: PropTypes.object,
};

export default Loader;
