import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import AutosizeInput from 'react-input-autosize';

const STYLES = {
  backgroundColor: 'transparent',
  border: 0,
  boxShadow: 'none',
  cursor: 'inherit',
  outline: 'none',
  padding: 0,
};

class HintedInput extends React.Component {
  render() {
    const {
      className,
      hintText,
      inputRef,
      isFocused,
      multiple,
      ...props
    } = this.props;

    return (
      <div style={{display: 'inline-block', position: 'relative'}}>
        <AutosizeInput
          {...props}
          autoComplete="off"
          inputClassName={cx('rbt-input-main', className)}
          inputStyle={STYLES}
          ref={inputRef}
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        />
        {this._renderHint()}
      </div>
    );
  }

  _renderHint = () => {
    const {hintText, isFocused, multiple} = this.props;

    // TODO: Support hinting for multi-selection.
    return multiple ?
      null :
      <AutosizeInput
        inputClassName="rbt-input-hint"
        inputStyle={{
          ...STYLES,
          color: 'rgba(0, 0, 0, 0.35)',
        }}
        style={{
          bottom: 0,
          display: 'block',
          position: 'absolute',
          top: 0,
          zIndex: 0,
        }}
        tabIndex={-1}
        value={isFocused ? hintText : ''}
      />;
  }
}

HintedInput.propTypes = {
  type: PropTypes.string,
};

HintedInput.defaultProps = {
  type: 'text',
};

export default HintedInput;
