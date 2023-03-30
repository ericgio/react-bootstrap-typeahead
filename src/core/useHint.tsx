import { useEffect, useRef } from 'react';

import { useTypeaheadContext } from './Context';

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

function useHint() {
  const { hintText, inputNode } = useTypeaheadContext();
  const hintRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Scroll hint input when the text input is scrolling.
    const handleInputScroll = () => {
      if (hintRef.current && inputNode) {
        hintRef.current.scrollLeft = inputNode.scrollLeft;
      }
    };

    inputNode?.addEventListener('scroll', handleInputScroll);
    return () => {
      inputNode?.removeEventListener('scroll', handleInputScroll);
    };
  }, [inputNode]);

  useEffect(() => {
    if (inputNode && hintRef.current) {
      copyStyles(inputNode, hintRef.current);
    }
  });

  return {
    hintRef,
    hintText,
  };
}

export default useHint;
