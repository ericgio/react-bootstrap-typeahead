import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AutosizeInput from './AutosizeInput.react';
import Token from './Token.react';

import { getOptionLabel, isSelectable } from './utils';
import hintContainer from './containers/hintContainer';

import { BACKSPACE } from './constants';

const HintedAutosizeInput = hintContainer(AutosizeInput);

class TypeaheadInputMulti extends React.Component {
  render() {
    const {
      className,
      inputClassName,
      labelKey,
      onRemove,
      renderToken,
      selected,
      ...props
    } = this.props;

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      <div
        className={cx('form-control', 'rbt-input-multi', className)}
        disabled={props.disabled}
        onClick={this._handleContainerClickOrFocus}
        onFocus={this._handleContainerClickOrFocus}
        tabIndex={-1}>
        <div className="rbt-input-wrapper" ref={(el) => this._wrapper = el}>
          {selected.map(this._renderToken)}
          <HintedAutosizeInput
            {...props}
            inputClassName={cx('rbt-input-main', inputClassName)}
            inputRef={(input) => {
              this._input = input;
              this.props.inputRef(input);
            }}
            inputStyle={{
              backgroundColor: 'transparent',
              border: 0,
              boxShadow: 'none',
              cursor: 'inherit',
              outline: 'none',
              padding: 0,
            }}
            onKeyDown={this._handleKeyDown}
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          />
        </div>
      </div>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
      /* eslint-enable jsx-a11y/click-events-have-key-events */
    );
  }

  _renderToken = (option, idx) => {
    const { onRemove, renderToken } = this.props;
    const props = {
      ...this.props,
      onRemove: () => onRemove(option),
    };

    return renderToken(option, props, idx);
  }

  /**
   * Forward click or focus events on the container element to the input.
   */
  _handleContainerClickOrFocus = (e) => {
    // Don't focus the input if it's disabled.
    if (this.props.disabled) {
      e.target.blur();
      return;
    }

    // Move cursor to the end if the user clicks outside the actual input.
    const inputNode = this._input;
    if (e.target !== inputNode && isSelectable(inputNode)) {
      inputNode.selectionStart = inputNode.value.length;
    }

    inputNode.focus();
  }

  _handleKeyDown = (e) => {
    const { onKeyDown, selected, value } = this.props;

    switch (e.keyCode) {
      case BACKSPACE:
        if (e.target === this._input && selected.length && !value) {
          // If the input is selected and there is no text, focus the last
          // token when the user hits backspace.
          const { children } = this._wrapper;
          const lastToken = children[children.length - 2];
          lastToken && lastToken.focus();
        }
        break;
      default:
        break;
    }

    onKeyDown(e);
  }
}

TypeaheadInputMulti.propTypes = {
  /**
   * Provides a hook for customized rendering of tokens when multiple
   * selections are enabled.
   */
  renderToken: PropTypes.func,
};

TypeaheadInputMulti.defaultProps = {
  renderToken: (option, props, idx) => (
    <Token
      disabled={props.disabled}
      key={idx}
      onRemove={props.onRemove}
      tabIndex={props.tabIndex}>
      {getOptionLabel(option, props.labelKey)}
    </Token>
  ),
};

export default TypeaheadInputMulti;
