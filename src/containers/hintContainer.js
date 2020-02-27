// @flow

import React, { type ComponentType } from 'react';

import { withContext } from '../core/Context';
import { getDisplayName, shouldSelectHint } from '../utils';

import type { CreateRef, InputRefHandler, KeyDownHandler, Ref } from '../types';

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
  forwardedRef: InputRefHandler,
  onKeyDown: KeyDownHandler,
};

function hintContainer(Input: ComponentType<*>) {
  class HintedInput extends React.Component<* & Props> {
    static displayName = `hintContainer(${getDisplayName(Input)})`;

    hintRef: CreateRef<HTMLInputElement> = React.createRef();
    _input: Ref<HTMLInputElement> = null;

    componentDidMount() {
      copyStyles(this._input, this.hintRef.current);
    }

    componentDidUpdate() {
      copyStyles(this._input, this.hintRef.current);
    }

    render() {
      const {
        forwardedRef,
        hintText,
        initialItem,
        onAdd,
        selectHintOnEnter,
        ...props
      } = this.props;

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
            onKeyDown={this._handleKeyDown}
            ref={this.getInputRef}
          />
          <input
            aria-hidden
            className="rbt-input-hint"
            ref={this.hintRef}
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
    }

    getInputRef = (input: Ref<HTMLInputElement>) => {
      this._input = input;
      this.props.forwardedRef(input);
    }

    _handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
      const { initialItem, onAdd, onKeyDown } = this.props;

      if (shouldSelectHint(e, this.props)) {
        e.preventDefault(); // Prevent input from blurring on TAB.
        onAdd(initialItem);
      }

      onKeyDown(e);
    }
  }

  const HintedInputWithContext = withContext(HintedInput, [
    'hintText',
    'initialItem',
    'onAdd',
    'selectHintOnEnter',
  ]);

  return React.forwardRef<{}, Ref<HTMLInputElement>>((props, ref) => (
    <HintedInputWithContext {...props} forwardedRef={ref} />
  ));
}

export default hintContainer;
