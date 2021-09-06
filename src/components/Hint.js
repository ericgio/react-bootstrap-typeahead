// @flow

import invariant from 'invariant';
import React, { cloneElement, useEffect, useRef } from 'react';

import type { Element } from 'react';

import { useTypeaheadContext } from '../core/Context';
import { isSelectable } from '../utils';

export type ShouldSelect = (
  boolean,
  SyntheticKeyboardEvent<HTMLInputElement>
) => boolean;

// IE doesn't seem to get the composite computed value (eg: 'padding',
// 'borderStyle', etc.), so generate these from the individual values.
function interpolateStyle(
  styles: Object,
  attr: string,
  subattr: string = ''
): string {
  // Title-case the sub-attribute.
  if (subattr) {
    /* eslint-disable-next-line no-param-reassign */
    subattr = subattr.replace(subattr[0], subattr[0].toUpperCase());
  }

  return ['Top', 'Right', 'Bottom', 'Left']
    .map((dir) => styles[attr + dir + subattr])
    .join(' ');
}

function copyStyles(inputNode: ?HTMLInputElement, hintNode: ?HTMLInputElement) {
  if (!inputNode || !hintNode) {
    return;
  }

  const inputStyle = window.getComputedStyle(inputNode);

  /* eslint-disable no-param-reassign */
  hintNode.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
  hintNode.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
  hintNode.style.fontSize = inputStyle.fontSize;
  hintNode.style.height = inputStyle.height;
  hintNode.style.lineHeight = inputStyle.lineHeight;
  hintNode.style.margin = interpolateStyle(inputStyle, 'margin');
  hintNode.style.padding = interpolateStyle(inputStyle, 'padding');
  /* eslint-enable no-param-reassign */
}

export function defaultShouldSelect(
  e: SyntheticKeyboardEvent<HTMLInputElement>,
  shouldSelect?: ShouldSelect
): boolean {
  let shouldSelectHint = false;

  const { currentTarget, key } = e;

  if (key === 'ArrowRight') {
    // For selectable input types ("text", "search"), only select the hint if
    // it's at the end of the input value. For non-selectable types ("email",
    // "number"), always select the hint.
    shouldSelectHint = isSelectable(currentTarget)
      ? currentTarget.selectionStart === currentTarget.value.length
      : true;
  }

  if (key === 'Tab') {
    // Prevent input from blurring on TAB.
    e.preventDefault();
    shouldSelectHint = true;
  }

  return typeof shouldSelect === 'function'
    ? shouldSelect(shouldSelectHint, e)
    : shouldSelectHint;
}

type Config = {
  children: Element<any>,
  shouldSelect?: ShouldSelect,
};

export const useHint = ({ children, shouldSelect }: Config) => {
  invariant(
    React.Children.count(children) === 1,
    '`useHint` expects one child.'
  );

  const { hintText, initialItem, inputNode, onAdd } = useTypeaheadContext();

  const hintRef = useRef<?HTMLInputElement>(null);

  const onKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (hintText && initialItem && defaultShouldSelect(e, shouldSelect)) {
      onAdd(initialItem);
    }

    children.props.onKeyDown && children.props.onKeyDown(e);
  };

  useEffect(() => {
    copyStyles(inputNode, hintRef.current);
  });

  return {
    child: cloneElement(children, { ...children.props, onKeyDown }),
    hintRef,
    hintText,
  };
};

type Props = Config & {
  className?: string,
};

const Hint = ({ className, ...props }: Props) => {
  const { child, hintRef, hintText } = useHint(props);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        position: 'relative',
      }}>
      {child}
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
