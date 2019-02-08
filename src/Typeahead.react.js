import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Typeahead from './core/Typeahead';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import { preventInputBlur } from './utils';

const propTypes = {
  /**
   * Specifies the size of the input.
   */
  bsSize: PropTypes.oneOf(['large', 'lg', 'small', 'sm']),
  /**
   * Displays a button to clear the input when there are selections.
   */
  clearButton: PropTypes.bool,
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel: PropTypes.node,
  /**
   * Bootstrap 4 only. Adds the `is-invalid` classname to the `form-control`.
   */
  isInvalid: PropTypes.bool,
  /**
   * Indicate whether an asynchronous data fetch is happening.
   */
  isLoading: PropTypes.bool,
  /**
   * Bootstrap 4 only. Adds the `is-valid` classname to the `form-control`.
   */
  isValid: PropTypes.bool,
  /**
   * Callback for custom input rendering.
   */
  renderInput: PropTypes.func,
  /**
   * Callback for custom menu rendering.
   */
  renderMenu: PropTypes.func,
};

const defaultProps = {
  clearButton: false,
  emptyLabel: 'No matches found.',
  isInvalid: false,
  isLoading: false,
  isValid: false,
  renderMenu: (results, menuProps) => (
    <TypeaheadMenu {...menuProps} options={results} />
  ),
};

class TypeaheadComponent extends React.Component {
  render() {
    const { children, className } = this.props;

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
              style={{ position: 'relative' }}
              tabIndex={-1}>
              <Typeahead.Input>
                {this._renderInput}
              </Typeahead.Input>
              <Typeahead.Menu>
                {this._renderMenu}
              </Typeahead.Menu>
              {auxContent}
              {typeof children === 'function' ? children(props) : children}
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
    const {
      bsSize,
      isInvalid,
      isValid,
      multiple,
      renderInput,
      renderToken,
    } = this.props;

    if (typeof renderInput === 'function') {
      return renderInput(inputProps);
    }

    const props = {
      ...inputProps,
      bsSize,
      isInvalid,
      isValid,
    };

    return multiple ?
      <TypeaheadInputMulti {...props} renderToken={renderToken} /> :
      <TypeaheadInputSingle {...props} />;
  }

  _renderMenu = (results, menuProps) => {
    const {
      emptyLabel,
      maxHeight,
      newSelectionPrefix,
      renderMenu,
      renderMenuItemChildren,
    } = this.props;

    return renderMenu(results, {
      ...menuProps,
      emptyLabel,
      maxHeight,
      newSelectionPrefix,
      renderMenuItemChildren,
    });
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

TypeaheadComponent.propTypes = propTypes;
TypeaheadComponent.defaultProps = defaultProps;

export default TypeaheadComponent;
