import cx from 'classnames';
import {noop} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import tokenContainer from './containers/tokenContainer';

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
class Token extends React.Component {
  displayName = 'Token';

  render() {
    return this.props.onRemove && !this.props.disabled ?
      this._renderRemoveableToken() :
      this._renderToken();
  }

  _renderRemoveableToken() {
    const {children, className, onRemove, selected, ...otherProps} = this.props;

    return (
      <div
        {...otherProps}
        className={cx('token', 'token-removeable', {
          'token-selected': selected,
        }, className)}
        tabIndex={0}>
        {children}
        <span
          className="close-button"
          onClick={onRemove}
          role="button">
          &times;
        </span>
      </div>
    );
  }

  _renderToken() {
    const {children, className, disabled, href} = this.props;
    const classnames = cx('token', {'token-disabled': disabled}, className);

    if (href) {
      return (
        <a className={classnames} href={href}>
          {children}
        </a>
      );
    }

    return (
      <div className={classnames}>
        {children}
      </div>
    );
  }
}

Token.propTypes = {
  /**
   * Handler for removing/deleting the token. If not defined, the token will
   * be rendered in a read-only state.
   */
  onRemove: PropTypes.func,
  selected: PropTypes.bool,
};

Token.defaultProps = {
  onRemove: noop,
  selected: false,
};


export default tokenContainer(Token);
