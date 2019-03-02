// @flow

import cx from 'classnames';
import React, { type Node } from 'react';
import PropTypes from 'prop-types';

import ClearButton from './ClearButton.react';

import tokenContainer from '../containers/tokenContainer';

const propTypes = {
  active: PropTypes.bool,
  /**
   * Handler for removing/deleting the token. If not defined, the token will
   * be rendered in a read-only state.
   */
  onRemove: PropTypes.func,
  tabIndex: PropTypes.number,
};

const defaultProps = {
  active: false,
  tabIndex: 0,
};

type Props = {
  active: boolean,
  children?: Node,
  className?: string,
  disabled?: boolean,
  href?: string,
  onRemove?: Function,
  tabIndex: number,
};

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
class Token extends React.Component<Props> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  render() {
    return this.props.onRemove && !this.props.disabled ?
      this._renderRemoveableToken() :
      this._renderToken();
  }

  _renderRemoveableToken = () => {
    const { active, children, className, onRemove, ...props } = this.props;

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
          tabIndex={-1}
        />
      </div>
    );
  }

  _renderToken = () => {
    const { children, className, disabled, href } = this.props;
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
}

export default tokenContainer(Token);
