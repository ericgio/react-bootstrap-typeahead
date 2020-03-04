// @flow

import React, {
  type ComponentType,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { useTypeaheadContext } from '../core/Context';
import { getDisplayName, shouldSelectHint } from '../utils';

import type { KeyboardEventHandler } from '../types';

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

type Props = {
  onKeyDown: KeyboardEventHandler<HTMLInputElement>,
};

function hintContainer(Input: ComponentType<*>) {
  const displayName = `hintContainer(${getDisplayName(Input)})`;

  // $FlowFixMe: Forwarded ref is causing errors...
  const HintedInput = forwardRef<Props, ?HTMLInputElement>((props, ref) => {
    const {
      hintText,
      initialItem,
      inputNode,
      onAdd,
      selectHintOnEnter,
    } = useTypeaheadContext();

    const hintRef = useRef<?HTMLInputElement>(null);

    const handleKeyDown = useCallback(
      (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (shouldSelectHint(e, { ...props, hintText, selectHintOnEnter })) {
          e.preventDefault(); // Prevent input from blurring on TAB.
          initialItem && onAdd(initialItem);
        }

        props.onKeyDown(e);
      },
    );

    useEffect(() => {
      copyStyles(inputNode, hintRef.current);
    });

    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: '100%',
          position: 'relative',
        }}>
        <Input
          {...props}
          onKeyDown={handleKeyDown}
          ref={ref}
        />
        <input
          aria-hidden
          className="rbt-input-hint"
          ref={hintRef}
          readOnly
          style={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            boxShadow: 'none',
            color: 'rgba(0, 0, 0, 0.35)',
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
  });

  HintedInput.displayName = displayName;

  return HintedInput;
}

export default hintContainer;
