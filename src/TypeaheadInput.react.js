import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import HintedInput from './HintedInput.react';
import Token from './Token.react';

import {getOptionLabel} from './utils/';
import typeaheadInputContainer from './containers/typeaheadInputContainer';

class TypeaheadInput extends React.Component {
  render() {
    const {
      className,
      disabled,
      inputProps,
      inputRef,
      multiple,
      selected,
    } = this.props;

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      <div
        className={cx('rbt-input', 'form-control', {
          'rbt-input-multi': multiple,
        }, className)}
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
