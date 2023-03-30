import React, { ReactNode } from 'react';

import useHint from '../../core/useHint';

export interface HintProps {
  children: ReactNode;
  className?: string;
}

const Hint = ({ children, className }: HintProps) => {
  const { hintRef, hintText } = useHint();

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        position: 'relative',
      }}>
      {children}
      <input
        aria-hidden
        className="rbt-input-hint"
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
        }}
        tabIndex={-1}
        value={hintText}
      />
    </div>
  );
};

export default Hint;
