import React, { ReactNode, useEffect, useRef } from 'react';

import { useTypeaheadContext } from '../../core/Context';

// IE doesn't seem to get the composite computed value (eg: 'padding',
// 'borderStyle', etc.), so generate these from the individual values.
function interpolateStyle(
  styles: CSSStyleDeclaration,
  attr: string,
  subattr = ''
): string {
  // Title-case the sub-attribute.
  if (subattr) {
    /* eslint-disable-next-line no-param-reassign */
    subattr = subattr.replace(subattr[0], subattr[0].toUpperCase());
  }

  return ['Top', 'Right', 'Bottom', 'Left']
    .map(
      (dir) => styles[`${attr}${dir}${subattr}` as keyof CSSStyleDeclaration]
    )
    .join(' ');
}

function copyStyles(inputNode: HTMLInputElement, hintNode: HTMLInputElement) {
  const inputStyle = window.getComputedStyle(inputNode);

  /* eslint-disable no-param-reassign */
  hintNode.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
  hintNode.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
  hintNode.style.fontSize = inputStyle.fontSize;
  hintNode.style.fontWeight = inputStyle.fontWeight;
  hintNode.style.height = inputStyle.height;
  hintNode.style.lineHeight = inputStyle.lineHeight;
  hintNode.style.margin = interpolateStyle(inputStyle, 'margin');
  hintNode.style.padding = interpolateStyle(inputStyle, 'padding');
  /* eslint-enable no-param-reassign */
}

export const useHint = () => {
  const { hintText, inputNode } = useTypeaheadContext();
  
  const hintRef = useRef<HTMLInputElement | null>(null);

  // scroll hint input when the text input is scrolling
  inputNode?.addEventListener("scroll", () => {
    hintRef.current!.scrollLeft = inputNode?.scrollLeft
  })
  
  useEffect(() => {
    if (inputNode && hintRef.current) {
      copyStyles(inputNode, hintRef.current);
    }
  });

  return {
    hintRef,
    hintText,
  };
};

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
