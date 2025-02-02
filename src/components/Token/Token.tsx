import cx from 'classnames';
import React, { forwardRef, HTMLProps, MouseEventHandler } from 'react';

import ClearButton from '../ClearButton';

import { useToken, UseTokenProps } from '../../core';
import { isFunction } from '../../utils';

type HTMLElementProps = Omit<HTMLProps<HTMLDivElement>, 'onBlur' | 'ref'>;

interface InteractiveTokenProps extends HTMLElementProps {
  active?: boolean;
  onRemove?: MouseEventHandler<HTMLElement>;
}

const InteractiveToken = forwardRef<HTMLDivElement, InteractiveTokenProps>(
  ({ active, children, className, onRemove, tabIndex, ...props }, ref) => (
    <div
      {...props}
      className={cx(
        'rbt-token',
        'rbt-token-removeable',
        {
          'rbt-token-active': !!active,
        },
        className
      )}
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
  )
);

interface StaticTokenProps extends HTMLElementProps {
  disabled?: boolean;
  href?: string;
}

const StaticToken = ({
  children,
  className,
  disabled,
  href,
}: StaticTokenProps) => {
  const classnames = cx(
    'rbt-token',
    {
      'rbt-token-disabled': disabled,
    },
    className
  );

  if (href && !disabled) {
    return (
      <a className={classnames} href={href}>
        {children}
      </a>
    );
  }

  return <div className={classnames}>{children}</div>;
};

export interface TokenProps<T> extends UseTokenProps<T> {
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Individual token component, generally displayed within the
 * `TypeaheadInputMulti` component, but can also be rendered on its own.
 */
const Token = ({
  children,
  option,
  readOnly,
  ...props
}: TokenProps<HTMLElement>) => {
  const { ref, ...tokenProps } = useToken({ ...props, option });
  const child = <div className="rbt-token-label">{children}</div>;

  return !props.disabled && !readOnly && isFunction(tokenProps.onRemove) ? (
    <InteractiveToken {...props} {...tokenProps} ref={ref}>
      {child}
    </InteractiveToken>
  ) : (
    <StaticToken {...props}>{child}</StaticToken>
  );
};

export default Token;
