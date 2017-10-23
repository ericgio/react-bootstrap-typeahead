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
      disabled,
      hintText,
      inputRef,
      isFocused,
      multiple,
      name,
      onBlur,
      onChange,
      onFocus,
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
      isFocused,
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
      <div className={cx('rbt-input', {'rbt-input-multi': multiple})}>
        {multiple && selected.map(this._renderToken)}
        <HintedInput {...inputProps} />
      </div>
    );
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

TypeaheadInput.propTypes = {
  /**
   * Provides a hook for customized rendering of tokens when multiple
   * selections are enabled.
   */
  renderToken: PropTypes.func,
};

export default typeaheadInputContainer(TypeaheadInput);
