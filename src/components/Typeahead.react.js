// @flow

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { type ElementRef } from 'react';

import Typeahead from '../core/Typeahead';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import { isFunction, preventInputBlur } from '../utils';

import type { TypeaheadMenuComponentProps } from './TypeaheadMenu.react';
import type { TypeaheadInputMultiComponentProps } from './TypeaheadInputMulti.react';
import type { InputProps } from '../core/TypeaheadInput';
import type { MenuProps } from '../core/TypeaheadMenu';
import type { BsSize, Option, TypeaheadProps, TypeaheadInnerProps } from '../types';

type Props =
  TypeaheadProps &
  TypeaheadInputMultiComponentProps &
  TypeaheadMenuComponentProps & {
    bsSize?: BsSize,
    className?: string,
    clearButton: boolean,
    isInvalid: boolean,
    isLoading: boolean,
    isValid: boolean,
    renderInput: Function,
    renderMenu: Function,
    renderToken: Function,
    style?: Object,
  };

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
  isInvalid: false,
  isLoading: false,
  isValid: false,
  renderMenu: (
    results: Option[],
    menuProps: MenuProps & TypeaheadMenuComponentProps
  ) => (
    // TODO: Merged props not registering correctly.
    // $FlowFixMe
    <TypeaheadMenu {...menuProps} options={results} />
  ),
};

class TypeaheadComponent extends React.Component<Props> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  _instance: ElementRef<*> = null;

  render() {
    const { children, className, style } = this.props;

    return (
      <Typeahead
        {...this.props}
        ref={(instance) => this._instance = instance}>
        {(props: Props & TypeaheadInnerProps) => {
          const auxContent = this._renderAux(props);

          return (
            <div
              className={cx('rbt', { 'has-aux': !!auxContent }, className)}
              style={{
                outline: 'none',
                position: 'relative',
                ...style,
              }}
              tabIndex={-1}>
              <Typeahead.Input>
                {this._renderInput}
              </Typeahead.Input>
              <Typeahead.Menu>
                {this._renderMenu}
              </Typeahead.Menu>
              {auxContent}
              {isFunction(children) ? children(props) : children}
            </div>
          );
        }}
      </Typeahead>
    );
  }

  getInstance = () => {
    return this._instance;
  }

  _renderInput = (inputProps: InputProps) => {
    const {
      bsSize,
      isInvalid,
      isValid,
      multiple,
      renderInput,
      renderToken,
    } = this.props;

    if (isFunction(renderInput)) {
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

  _renderMenu = (results: Option[], menuProps: MenuProps) => {
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

  _renderAux = (props: Props & TypeaheadInnerProps) => {
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

export default TypeaheadComponent;
