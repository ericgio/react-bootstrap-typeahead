import cx from 'classnames';
import {noop} from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';

import ClearButton from './ClearButton.react';

import tokenContainer from './containers/tokenContainer';
import {RETURN} from './constants/keyCode';

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
class Token extends React.Component {
  render() {
    return this.props.onRemove && !this.props.disabled ?
      this._renderRemoveableToken() :
      this._renderToken();
  }

  _renderRemoveableToken = () => {
    const {active, children, className, onRemove, ...props} = this.props;

    return (
      <div
        {...props}
        className={cx('rbt-token', 'rbt-token-removeable', {
          'rbt-token-active': active,
        }, className)}>
        {children}
        <ClearButton
          className="rbt-token-remove-button"
          label="Remove"
          onClick={onRemove}
          onKeyDown={this._handleRemoveButtonKeydown}
          tabIndex={-1}
        />
      </div>
    );
  }

  _renderToken = () => {
    const {children, className, disabled, href} = this.props;
    const classnames = cx('rbt-token', {
      'rbt-token-disabled': disabled,
    }, className);

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

  _handleRemoveButtonKeydown = (e) => {
    switch (e.keyCode) {
      case RETURN:
        this.props.onRemove();
        break;
    }
  }
}

Token.propTypes = {
  active: PropTypes.bool,
  /**
   * Handler for removing/deleting the token. If not defined, the token will
   * be rendered in a read-only state.
   */
  onRemove: PropTypes.func,
  tabIndex: PropTypes.number,
};

Token.defaultProps = {
  active: false,
  onRemove: noop,
  tabIndex: 0,
};


export default tokenContainer(Token);
