// @flow

import cx from 'classnames';
import React, { forwardRef } from 'react';

import type { Node } from 'react';

import ClearButton from './ClearButton';

import { withToken } from '../behaviors/token';
import { isFunction } from '../utils';

import type { OptionHandler } from '../types';

type Props = {
  active: boolean,
  children?: Node,
  className?: string,
  disabled?: boolean,
  href?: string,
  onRemove?: OptionHandler,
  readOnly?: boolean,
  tabIndex?: number,
};

const InteractiveToken = forwardRef<Props, ?HTMLElement>((
  { active, children, className, onRemove, tabIndex, ...props },
  ref
) => (
  <div
    {...props}
    className={cx('rbt-token', 'rbt-token-removeable', {
      'rbt-token-active': !!active,
    }, className)}
    ref={ref}
    tabIndex={tabIndex || 0}>
    {children}
    <ClearButton
      className="rbt-token-remove-button"
      label="Remove"
      onClick={onRemove}
      tabIndex={-1}
    />
  </div>
));

const StaticToken = ({ children, className, disabled, href }) => {
  const classnames = cx('rbt-token', {
    'rbt-token-disabled': disabled,
  }, className);

  if (href && !disabled) {
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
};

/**
 * Token
 *
 * Individual token component, generally displayed within the TokenizerInput
 * component, but can also be rendered on its own.
 */
const Token = forwardRef<Props, ?HTMLElement>((props, ref) => {
  const { disabled, onRemove, readOnly } = props;

  return !disabled && !readOnly && isFunction(onRemove) ?
    <InteractiveToken {...props} ref={ref} /> :
    <StaticToken {...props} />;
});

export default withToken(Token);
