import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import TypeaheadInput from './base/TypeaheadInput';
import TypeaheadManager from './base/TypeaheadManager';
import TypeaheadMenu from './base/TypeaheadMenu';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenuComponent from './TypeaheadMenu.react';

import {getAccessibilityStatus, preventInputBlur} from './utils';

class Typeahead extends React.Component {
  render() {
    const {children, className, renderMenu} = this.props;

    return (
      <TypeaheadManager
        {...this.props}
        ref={(instance) => this._instance = instance}>
        {(props) => {
          const auxContent = this._renderAux(props);

          return (
            <div
              className={cx('rbt', 'clearfix', 'open', {
                'has-aux': !!auxContent,
              }, className)}
              style={{position: 'relative'}}
              tabIndex={-1}>
              <TypeaheadInput {...props}>
                {this._renderInput}
              </TypeaheadInput>
              {typeof children === 'function' ? children(props) : children}
              {auxContent}
              <TypeaheadMenu {...props}>
                {renderMenu}
              </TypeaheadMenu>
              <div
                aria-atomic
                aria-live="polite"
                className="sr-only rbt-sr-status"
                role="status">
                {getAccessibilityStatus(props)}
              </div>
            </div>
          );
        }}
      </TypeaheadManager>
    );
  }

  getInstance = () => {
    return this._instance;
  }

  _renderInput = (inputProps) => {
    const Input = inputProps.multiple ?
      TypeaheadInputMulti :
      TypeaheadInputSingle;

    return <Input {...inputProps} />;
  }

  _renderAux = (props) => {
    const {
      bsSize,
      clearButton,
      disabled,
      isLoading,
      onClear,
      selected,
    } = props;

    let content;

    if (isLoading) {
      content = <Loader bsSize={bsSize} />;
    } else if (clearButton && !disabled && selected.length) {
      content =
        <ClearButton
          bsSize={bsSize}
          onClick={onClear}
          onFocus={(e) => {
            // Prevent the main input from auto-focusing again.
            e.stopPropagation();
          }}
          onMouseDown={preventInputBlur}
        />;
    }

    return content ?
      <div
        className={cx('rbt-aux', {
          'rbt-aux-lg': bsSize === 'large' || bsSize === 'lg',
        })}>
        {content}
      </div> :
      null;
  }
}

Typeahead.propTypes = {
  renderMenu: PropTypes.func,
};

Typeahead.defaultProps = {
  renderMenu: (results, menuProps) => (
    <TypeaheadMenuComponent {...menuProps} options={results} />
  ),
};

export default Typeahead;
