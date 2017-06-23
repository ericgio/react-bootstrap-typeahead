import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

class TextInput extends React.Component {
  render() {
    const {bsSize, className, hasAux, ...otherProps} = this.props;

    return (
      <input
        {...otherProps}
        className={cx('form-control', {
          'has-aux': hasAux,
          'input-lg': bsSize === 'large' || bsSize === 'lg',
          'input-sm': bsSize === 'small' || bsSize === 'sm',
        }, className)}
        ref={input => this._input = input}
        type="text"
      />
    );
  }

  getInstance() {
    return this._input;
  }
}

TextInput.propTypes = {
  /**
   * Specify the size of the input.
   */
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
};

export default TextInput;
