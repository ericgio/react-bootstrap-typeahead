'use strict';

import cx from 'classnames';
import {noop} from 'lodash';
import React, {PropTypes} from 'react';

import tokenBehaviors from './containers/tokenBehaviors';

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
const Token = React.createClass({
  displayName: 'Token',

  propTypes: {
    /**
     * Handler for removing/deleting the token. If not defined, the token will
     * be rendered in a read-only state.
     */
    onRemove: PropTypes.func,
    selected: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      onRemove: noop,
      selected: false,
    };
  },

  render() {
    return this.props.onRemove && !this.props.disabled ?
      this._renderRemoveableToken() :
      this._renderToken();
  },

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
  },

  _renderToken() {
    const {children, className, disabled, href} = this.props;
    const classnames = cx('token', className);

    if (href) {
      return (
        <a className={classnames} disabled={disabled} href={href}>
          {children}
        </a>
      );
    }

    return (
      <div className={classnames} disabled={disabled}>
        {children}
      </div>
    );
  },
});

export default tokenBehaviors(Token);
