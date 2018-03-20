import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import HintedInput from './HintedInput.react';
import Token from './Token.react';

import {getOptionLabel, preventInputBlur} from './utils/';
import typeaheadInputContainer from './containers/typeaheadInputContainer';

class TypeaheadInput extends React.Component {
  render() {
    const {
      bsSize,
      disabled,
      inputProps,
      inputRef,
      isFocused,
      multiple,
      selected,
    } = this.props;

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      <div
        className={cx('rbt-input', 'form-control', {
          'focus': isFocused,
          'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
          'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
          'rbt-input-multi': multiple,
        })}
        disabled={disabled}
        onClick={this._handleContainerClickOrFocus}
        onFocus={this._handleContainerClickOrFocus}
        tabIndex={-1}>
        <div className="rbt-input-wrapper">
          {multiple && selected.map(this._renderToken)}
          <HintedInput
            {...inputProps}
            inputRef={(el) => {
              this._input = el;
              inputRef(el);
            }}
            multiple={multiple}
          />
        </div>
        {this._renderAux()}
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

  _renderAux = () => {
    const {
      bsSize,
      clearButton,
      disabled,
      isLoading,
      onClear,
      selected,
    } = this.props;

    if (isLoading) {
      return (
        <div className="rbt-aux">
          <Loader bsSize={bsSize} />
        </div>
      );
    }

    if (clearButton && !disabled && selected.length) {
      return (
        <div className="rbt-aux">
          <ClearButton
            bsSize={bsSize}
            onClick={onClear}
            onFocus={(e) => {
              // Prevent the main input from auto-focusing again.
              e.stopPropagation();
            }}
            onMouseDown={preventInputBlur}
          />
        </div>
      );
    }
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
}

TypeaheadInput.propTypes = {
  /**
   * Provides a hook for customized rendering of tokens when multiple
   * selections are enabled.
   */
  renderToken: PropTypes.func,
};

TypeaheadInput.defaultProps = {
  renderToken: (option, props, idx) => (
    <Token
      disabled={props.disabled}
      key={idx}
      onRemove={props.onRemove}
      tabIndex={props.inputProps.tabIndex}>
      {getOptionLabel(option, props.labelKey)}
    </Token>
  ),
};

export default typeaheadInputContainer(TypeaheadInput);
