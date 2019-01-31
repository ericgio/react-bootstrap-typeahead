import React from 'react';

import AutosizeInput from '../AutosizeInput.react';
import { withContext } from '../TypeaheadContext';

import { getDisplayName, shouldSelectHint } from '../utils';

// IE doesn't seem to get the composite computed value (eg: 'padding',
// 'borderStyle', etc.), so generate these from the individual values.
function interpolateStyle(styles, attr, subattr = '') {
  // Title-case the sub-attribute.
  if (subattr) {
    /* eslint-disable-next-line no-param-reassign */
    subattr = subattr.replace(subattr[0], subattr[0].toUpperCase());
  }

  return ['Top', 'Right', 'Bottom', 'Left']
    .map((dir) => styles[attr + dir + subattr])
    .join(' ');
}

function copyStyles(inputNode, hintNode) {
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

function hintContainer(Input) {
  class HintedInput extends React.Component {
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
          className="rbt-input-hint-container"
          style={{ position: 'relative' }}>
          <Input
            {...props}
            inputRef={(input) => {
              this._input = input;
              inputRef(input);
            }}
            onKeyDown={this._handleKeyDown}
          />
          <AutosizeInput
            aria-hidden
            className="rbt-input-hint"
            inputRef={(hint) => this._hint = hint}
            inputStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              color: 'rgba(0, 0, 0, 0.35)',
            }}
            readOnly
            style={{
              left: 0,
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
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

  HintedInput.displayName = `HintContainer(${getDisplayName(Input)})`;

  return withContext(HintedInput, [
    'hintText',
    'initialItem',
    'onAdd',
    'selectHintOnEnter',
  ]);
}

export default hintContainer;
