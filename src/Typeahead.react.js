import cx from 'classnames';
import React from 'react';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Overlay from './Overlay.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import typeaheadContainer from './containers/typeaheadContainer';
import {addCustomOption, getOptionLabel, getTruncatedOptions} from './utils/';

class Typeahead extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {
      allowNew,
      onInitialItemChange,
      onResultsChange,
      results,
    } = nextProps;

    // Clear the initial item when there are no results.
    if (!(allowNew || results.length)) {
      onInitialItemChange(null);
    }

    if (results.length !== this.props.results.length) {
      onResultsChange(results);
    }
  }

  render() {
    const {
      allowNew,
      bsSize,
      className,
      disabled,
      dropup,
      emptyLabel,
      isFocused,
      labelKey,
      minLength,
      onInputChange,
      onInputFocus,
      onKeyDown,
      onSelectionAdd,
      onSelectionRemove,
      paginate,
      showMenu,
      shownResults,
      text,
    } = this.props;

    let results = this.props.results.slice();

    // This must come before we truncate.
    const shouldPaginate = paginate && results.length > shownResults;

    // Truncate if necessary.
    results = getTruncatedOptions(results, shownResults);

    // Add the custom option.
    if (allowNew) {
      results = addCustomOption(results, text, labelKey);
    }

    const menuVisible = !!(
      showMenu &&
      text.length >= minLength &&
      (results.length || emptyLabel !== '')
    );

    return (
      <div
        className={cx('rbt', 'open', 'form-control', {
          'dropup': dropup,
          'focus': isFocused,
          'input-lg form-control-lg': bsSize === 'large' || bsSize === 'lg',
          'input-sm form-control-sm': bsSize === 'small' || bsSize === 'sm',
        }, className)}
        disabled={disabled}
        onClick={onInputFocus}
        onFocus={onInputFocus}
        style={{position: 'relative'}}
        tabIndex={-1}>
        <TypeaheadInput
          {...this.props}
          onAdd={onSelectionAdd}
          onChange={onInputChange}
          onKeyDown={(e) => onKeyDown(results, e)}
          onRemove={onSelectionRemove}
          options={results}
          ref={(input) => this._input = input}
        />
        {this._renderAux()}
        {this._renderMenu(results, shouldPaginate, menuVisible)}
        <div
          aria-live="polite"
          className="sr-only rbt-sr-status"
          role="status">
          {this._renderAccessibilityStatus(results, menuVisible)}
        </div>
      </div>
    );
  }

  getInputNode() {
    return this._input.getInputNode();
  }

  _renderAux = () => {
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
        <div className="rbt-aux">
          <Loader bsSize={bsSize} />
        </div>
      );
    }

    if (clearButton && !disabled && selected.length) {
      return (
        <div className="rbt-aux">
          <ClearButton
            bsSize={bsSize}
            onClick={onClear}
          />
        </div>
      );
    }
  }

  _renderMenu = (results, shouldPaginate, menuVisible) => {
    const {
      align,
      bodyContainer,
      className,
      dropup,
      emptyLabel,
      labelKey,
      maxHeight,
      newSelectionPrefix,
      onMenuHide,
      onMenuShow,
      onPaginate,
      paginationText,
      renderMenu,
      renderMenuItemChildren,
      text,
    } = this.props;

    const menuProps = {
      align,
      dropup,
      emptyLabel,
      labelKey,
      maxHeight,
      newSelectionPrefix,
      paginationText,
      onPaginate,
      paginate: shouldPaginate,
      text,
    };

    const menu = typeof renderMenu === 'function' ?
      renderMenu(results, menuProps) :
      <TypeaheadMenu
        {...menuProps}
        options={results}
        renderMenuItemChildren={renderMenuItemChildren}
      />;

    return (
      <Overlay
        align={align}
        className={className}
        container={bodyContainer ? document.body : this}
        dropup={dropup}
        onMenuHide={onMenuHide}
        onMenuShow={onMenuShow}
        show={menuVisible}
        target={this}>
        {menu}
      </Overlay>
    );
  }

  _renderAccessibilityStatus = (results, menuVisible) => {
    const {activeItem, emptyLabel, labelKey, selected} = this.props;

    if (!menuVisible) {
      return selected.length === 1 ?
        '1 selection' :
        `${selected.length} selections`;
    }

    // Let the user know which result is active when keying up and down.
    if (activeItem) {
      return getOptionLabel(activeItem, labelKey);
    }

    // Display info about the number of matches.
    if (results.length === 0) {
      return emptyLabel;
    }

    const resultString = results.length === 1 ?
      '1 result' :
      `${results.length} results`;

    return `${resultString}. Use up and down arrow keys to navigate.`;
  }
}

export default typeaheadContainer(Typeahead);
