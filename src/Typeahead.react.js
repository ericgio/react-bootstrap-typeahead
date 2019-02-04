import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Typeahead from './core/Typeahead';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import {getAccessibilityStatus, preventInputBlur} from './utils';

class TypeaheadComponent extends React.Component {
  render() {
    const {children, className, renderMenu} = this.props;

    return (
      <Typeahead
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
              <Typeahead.Input {...props}>
                {this._renderInput}
              </Typeahead.Input>
              {typeof children === 'function' ? children(props) : children}
              {auxContent}
              <Typeahead.Menu {...props}>
                {renderMenu}
              </Typeahead.Menu>
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
      </Typeahead>
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

TypeaheadComponent.propTypes = {
  renderMenu: PropTypes.func,
};

TypeaheadComponent.defaultProps = {
  renderMenu: (results, menuProps) => (
    <TypeaheadMenu {...menuProps} options={results} />
  ),
};

export default TypeaheadComponent;
