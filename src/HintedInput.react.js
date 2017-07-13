import {noop} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import AutosizeInput from 'react-input-autosize';

const STYLES = {
  backgroundColor: 'transparent',
  border: 0,
  boxShadow: 'none',
  cursor: 'inherit',
  display: 'block',
  outline: 'none',
  padding: 0,
};

class HintedInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
  }

  render() {
    const {hintText, inputRef, ...props} = this.props;

    return (
      <div style={{display: 'inline-block', position: 'relative'}}>
        <AutosizeInput
          {...props}
          autoComplete="off"
          inputClassName="rbt-input-main"
          inputStyle={STYLES}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          ref={inputRef}
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        />
        {this._renderHint(hintText)}
      </div>
    );
  }

  _renderHint = hintText => {
    // TODO: Support hinting for multi-selection.
    return this.props.multiple ?
      null :
      <AutosizeInput
        inputClassName="rbt-input-hint"
        inputStyle={STYLES}
        style={{
          bottom: 0,
          color: '#a5a5a5',
          display: 'block',
          position: 'absolute',
          top: 0,
          zIndex: 0,
        }}
        tabIndex={-1}
        value={this.state.isFocused ? hintText : ''}
      />;
  }

  _handleBlur = e => {
    this.setState({isFocused: false});
    this.props.onBlur(e);
  }

  _handleFocus = e => {
    this.setState({isFocused: true});
    this.props.onFocus(e);
  }
}

HintedInput.propTypes = {
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.string,
};

HintedInput.defaultProps = {
  onBlur: noop,
  onFocus: noop,
  type: 'text',
};

export default HintedInput;
