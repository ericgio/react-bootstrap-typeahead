import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import ClearButton from './ClearButton.react';
import HintedInput from './HintedInput.react';
import Loader from './Loader.react';
import Token from './Token.react';

import getOptionLabel from './utils/getOptionLabel';
import typeaheadInputContainer from './containers/typeaheadInputContainer';

class TypeaheadInput extends React.Component {
  render() {
    const {
      bsSize,
      disabled,
      hintText,
      inputRef,
      isFocused,
      multiple,
      name,
      onBlur,
      onChange,
      onFocus,
      onInputFocus,
      onKeyDown,
      placeholder,
      selected,
      value,
    } = this.props;

    const inputProps = {
      ...this.props.inputProps,
      disabled,
      hintText,
      inputRef,
      multiple,
      name: name || this.props.inputProps.name,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      placeholder,
      value,
    };

    return (
      <div
        className={cx('rbt-input-container', 'clearfix', 'form-control', {
          'focus': isFocused,
          'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
          'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
        })}
        disabled={disabled}
        onClick={onInputFocus}
        onFocus={onInputFocus}
        tabIndex={-1}>
        <div className={cx('rbt-input', {'rbt-input-multi': multiple})}>
          {multiple && selected.map(this._renderToken)}
          <HintedInput {...inputProps} />
        </div>
        {this._renderInputAux()}
      </div>
    );
  }

  _renderInputAux = () => {
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
        <div className="rbt-input-aux">
          <Loader bsSize={bsSize} />
        </div>
      );
    }

    if (clearButton && !disabled && selected.length) {
      return (
        <div className="rbt-input-aux">
          <ClearButton
            bsSize={bsSize}
            onClick={onClear}
          />
        </div>
      );
    }
  }

  _renderToken = (option, idx) => {
    const {disabled, inputProps, labelKey, onRemove, renderToken} = this.props;
    const onRemoveWrapped = () => onRemove(option);

    if (typeof renderToken === 'function') {
      return renderToken(option, onRemoveWrapped, idx);
    }

    return (
      <Token
        disabled={disabled}
        key={idx}
        onRemove={onRemoveWrapped}
        tabIndex={inputProps.tabIndex}>
        {getOptionLabel(option, labelKey)}
      </Token>
    );
  }
}

/**
 * In addition to the propTypes below, the following props are automatically
 * passed down by `Typeahead`:
 *
 *  - activeIndex
 *  - labelKey
 *  - onAdd
 *  - onBlur
 *  - onChange
 *  - onClick
 *  - onFocus
 *  - onKeydown
 *  - onRemove
 *  - options
 *  - selected
 *  - value
 */
TypeaheadInput.propTypes = {
  /**
   * Whether to disable the input and all selections.
   */
  disabled: PropTypes.bool,
  /**
   * Placeholder text for the input.
   */
  placeholder: PropTypes.string,
  /**
   * Provides a hook for customized rendering of tokens when multiple
   * selections are enabled.
   */
  renderToken: PropTypes.func,
};

TypeaheadInput.defaultProps = {
  disabled: false,
  placeholder: '',
};

export default typeaheadInputContainer(TypeaheadInput);
