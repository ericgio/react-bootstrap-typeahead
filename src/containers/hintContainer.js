import PropTypes from 'prop-types';
import React from 'react';

import {getDisplayName} from '../utils/';

// IE doesn't seem to get the composite computed value (eg: 'padding',
// 'borderStyle', etc.), so generate these from the individual values.
function interpolateStyle(styles, attr, subattr='') {
  // Title-case the sub-attribute.
  if (subattr) {
    subattr = subattr.replace(subattr[0], subattr[0].toUpperCase());
  }

  return ['Top', 'Right', 'Bottom', 'Left']
    .map((dir) => styles[attr + dir + subattr])
    .join(' ');
}

function copyStyles(inputNode, hintNode) {
  const inputStyle = window.getComputedStyle(inputNode);

  hintNode.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
  hintNode.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
  hintNode.style.fontSize = inputStyle.fontSize;
  hintNode.style.lineHeight = inputStyle.lineHeight;
  hintNode.style.padding = interpolateStyle(inputStyle, 'padding');
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
      return (
        <div
          className="rbt-input-hint-container"
          style={{position: 'relative'}}>
          <Input
            {...this.props}
            inputRef={(input) => {
              this._input = input;
              this.props.inputRef(input);
            }}
          />
          <div
            aria-hidden
            className="rbt-input-hint"
            ref={(hint) => this._hint = hint}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              bottom: 0,
              boxShadow: 'none',
              color: 'rgba(0, 0, 0, 0.35)',
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              zIndex: 0,
            }}
            tabIndex={-1}>
            {this.context.hintText}
          </div>
        </div>
      );
    }
  }

  HintedInput.contextTypes = {
    hintText: PropTypes.string.isRequired,
  };

  HintedInput.displayName = `HintContainer(${getDisplayName(Input)})`;

  return HintedInput;
}

export default hintContainer;
