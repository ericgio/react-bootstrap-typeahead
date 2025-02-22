import cx from 'classnames';
import React, { CSSProperties, ReactNode } from 'react';

import { useHint } from '../../hooks';

export interface HintProps {
  children: ReactNode;
  className?: string;
  hintClassName?: string;
  hintStyle?: CSSProperties;
  style?: CSSProperties;
}

const Hint = (props: HintProps) => {
  const { hintRef, hintText } = useHint();

  return (
    <div
      className={props.className}
      style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        position: 'relative',
        ...props.style,
      }}>
      {props.children}
      <input
        aria-hidden
        className={cx('rbt-input-hint', props.hintClassName)}
        ref={hintRef}
        readOnly
        style={{
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          boxShadow: 'none',
          color: 'rgba(0, 0, 0, 0.54)',
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          width: '100%',
          ...props.hintStyle,
        }}
        tabIndex={-1}
        value={hintText}
      />
    </div>
  );
};

export default Hint;
