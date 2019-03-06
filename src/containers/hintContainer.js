// @flow

import React, { type ComponentType, type ElementRef } from 'react';

import { type InputContextType, withContext } from '../core/Context';

import { getDisplayName, shouldSelectHint } from '../utils';

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

function copyStyles(inputNode: HTMLInputElement, hintNode: HTMLInputElement) {
  const inputStyle = window.getComputedStyle(inputNode);

  /* eslint-disable no-param-reassign */
  hintNode.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
  hintNode.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
  hintNode.style.fontSize = inputStyle.fontSize;
  hintNode.style.lineHeight = inputStyle.lineHeight;
  hintNode.style.margin = interpolateStyle(inputStyle, 'margin');
  hintNode.style.padding = interpolateStyle(inputStyle, 'padding');
  /* eslint-enable no-param-reassign */
}

type Props = InputContextType & {
  inputRef: Function,
  onKeyDown: Function,
};

function hintContainer(Input: ComponentType<*>) {
  class HintedInput extends React.Component<* & Props> {
    static displayName = `hintContainer(${getDisplayName(Input)})`;

    _hint: ElementRef<*> = undefined;
    _input: ElementRef<*> = undefined;

    componentDidMount() {
      copyStyles(this._input, this._hint);
    }

    componentDidUpdate() {
      copyStyles(this._input, this._hint);
    }

    render() {
      const {
        hintText,
        initialItem,
        inputRef,
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
            inputRef={(input) => {
              this._input = input;
              inputRef(input);
            }}
            onKeyDown={this._handleKeyDown}
          />
          <input
            aria-hidden
            className="rbt-input-hint"
            ref={(hint) => this._hint = hint}
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

    _handleKeyDown = (e) => {
      const { initialItem, onAdd, onKeyDown } = this.props;

      if (shouldSelectHint(e, this.props)) {
        e.preventDefault(); // Prevent input from blurring on TAB.
        onAdd(initialItem);
      }

      onKeyDown(e);
    }
  }

  return withContext(HintedInput, [
    'hintText',
    'initialItem',
    'onAdd',
    'selectHintOnEnter',
  ]);
}

export default hintContainer;
