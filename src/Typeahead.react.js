import cx from 'classnames';
import React from 'react';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Overlay from './Overlay.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import addCustomOption from './utils/addCustomOption';
import getTruncatedOptions from './utils/getTruncatedOptions';
import typeaheadContainer from './containers/typeaheadContainer';

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
      isFocused,
      labelKey,
      onInputChange,
      onInputFocus,
      onKeyDown,
      onSelectionAdd,
      onSelectionRemove,
      paginate,
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
          onKeyDown={e => onKeyDown(results, e)}
          onRemove={onSelectionRemove}
          options={results}
          ref={input => this._input = input}
        />
        {this._renderAux()}
        {this._renderMenu(results, shouldPaginate)}
      </div>
    );
  }

  getInputNode() {
    return this._input.getInputNode();
  }

  _renderMenu = (results, shouldPaginate) => {
    const {
      align,
      bodyContainer,
      className,
      dropup,
      emptyLabel,
      labelKey,
      maxHeight,
      minLength,
      newSelectionPrefix,
      onMenuHide,
      onMenuShow,
      onPaginate,
      paginationText,
      renderMenu,
      renderMenuItemChildren,
      showMenu,
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

    const show = !!(
      showMenu &&
      text.length >= minLength &&
      (results.length || emptyLabel !== '')
    );

    return (
      <Overlay
        align={align}
        className={className}
        container={bodyContainer ? document.body : this}
        dropup={dropup}
        onMenuHide={onMenuHide}
        onMenuShow={onMenuShow}
        show={show}
        target={this}>
        {menu}
      </Overlay>
    );
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
}

export default typeaheadContainer(Typeahead);
