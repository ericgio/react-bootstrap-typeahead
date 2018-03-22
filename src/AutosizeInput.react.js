import PropTypes from 'prop-types';
import React from 'react';

const SIZER_STYLE = {
  height: 0,
  left: 0,
  overflow: 'scroll',
  position: 'absolute',
  top: 0,
  visibility: 'hidden',
  whiteSpace: 'pre',
};

const INPUT_PROPS_BLACKLIST = [
  'inputClassName',
  'inputRef',
  'inputStyle',
];

const MIN_WIDTH = 1;

const cleanInputProps = (inputProps) => {
  INPUT_PROPS_BLACKLIST.forEach((field) => delete inputProps[field]);
  return inputProps;
};

const copyStyles = (styles, node) => {
  node.style.fontSize = styles.fontSize;
  node.style.fontFamily = styles.fontFamily;
  node.style.fontWeight = styles.fontWeight;
  node.style.fontStyle = styles.fontStyle;
  node.style.letterSpacing = styles.letterSpacing;
  node.style.textTransform = styles.textTransform;
};

class AutosizeInput extends React.Component {
  state = {
    inputWidth: MIN_WIDTH,
  };

  componentDidMount() {
    this._updateInputWidth();
  }

  componentDidUpdate(prevProps, prevState) {
    this._updateInputWidth();
  }

  render() {
    const {className, defaultValue, placeholder, value} = this.props;

    const wrapperStyle = {...this.props.style};
    if (!wrapperStyle.display) {
      wrapperStyle.display = 'inline-block';
    }

    const inputProps = cleanInputProps({
      ...this.props,
      className: this.props.inputClassName,
      style: {
        ...this.props.inputStyle,
        boxSizing: 'content-box',
        width: `${this.state.inputWidth}px`,
      },
    });

    return (
      <div className={className} style={wrapperStyle}>
        <input {...inputProps} ref={this._getInputRef} />
        <div
          ref={(el) => this._sizer = el}
          style={SIZER_STYLE}>
          {defaultValue || value || ''}
        </div>
        {placeholder ?
          <div
            ref={(el) => this._placeHolderSizer = el}
            style={SIZER_STYLE}>
            {placeholder}
          </div> :
          null
        }
      </div>
    );
  }

  getInput() {
    return this._input;
  }

  _getInputRef = (el) => {
    this._input = el;
    if (typeof this.props.inputRef === 'function') {
      this.props.inputRef(el);
    }
  };

  _copyInputStyles = () => {
    const inputStyles =
      this._input &&
      window.getComputedStyle &&
      window.getComputedStyle(this._input);

    if (!inputStyles) {
      return;
    }

    copyStyles(inputStyles, this._sizer);

    if (this._placeHolderSizer) {
      copyStyles(inputStyles, this._placeHolderSizer);
    }
  }

  _updateInputWidth = () => {
    if (!this._sizer || this._sizer.scrollWidth === undefined) {
      return;
    }

    this._copyInputStyles();

    const placeholderWidth =
      (this._placeHolderSizer && this._placeHolderSizer.scrollWidth) ||
      MIN_WIDTH;

    const inputWidth = Math.max(this._sizer.scrollWidth, placeholderWidth) + 2;

    if (inputWidth !== this.state.inputWidth) {
      this.setState({inputWidth});
    }
  }
}

AutosizeInput.propTypes = {
  /**
   * ClassName for the input element.
   */
  inputClassName: PropTypes.string,
  /**
   * Ref callback for the input element.
   */
  inputRef: PropTypes.func,
  /**
   * CSS styles for the input element.
   */
  inputStyle: PropTypes.object,
};

export default AutosizeInput;
