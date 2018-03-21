import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

import AutosizeInput from './AutosizeInput.react';
import Token from './Token.react';

import {getOptionLabel} from './utils/';
import inputContainer from './containers/inputContainer';

import {BACKSPACE} from './constants/keyCode';

class TypeaheadInputMulti extends React.Component {
  render() {
    const {
      className,
      inputClassName,
      inputRef,
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
        <div className="rbt-input-wrapper">
          {selected.map(this._renderToken)}
          <AutosizeInput
            {...props}
            inputClassName={cx('rbt-input-main', inputClassName)}
            inputStyle={{
              backgroundColor: 'transparent',
              border: 0,
              boxShadow: 'none',
              cursor: 'inherit',
              outline: 'none',
              padding: 0,
            }}
            onKeyDown={this._handleKeyDown}
            ref={(input) => {
              this._input = input;
              inputRef(input);
            }}
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
    const {onRemove, renderToken} = this.props;
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
    const inputNode = this._input.getInput();
    if (e.target !== inputNode) {
      inputNode.selectionStart = inputNode.value.length;
    }

    inputNode.focus();
  }

  _handleKeyDown = (e) => {
    const {onKeyDown, value} = this.props;

    switch (e.keyCode) {
      case BACKSPACE:
        const inputContainer = findDOMNode(this._input);
        if (
          inputContainer &&
          inputContainer.contains(document.activeElement) &&
          !value
        ) {
          // If the input is selected and there is no text, select the last
          // token when the user hits backspace.
          const sibling = inputContainer.previousSibling;
          sibling && sibling.focus();

          // Prevent browser "back" action.
          e.preventDefault();
        }
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

export default inputContainer(TypeaheadInputMulti);
