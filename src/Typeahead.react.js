import cx from 'classnames';
import React from 'react';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Overlay from './Overlay.react';
import TokenizerInput from './TokenizerInput.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import addCustomOption from './utils/addCustomOption';
import getHintText from './utils/getHintText';
import getInputText from './utils/getInputText';
import getTruncatedOptions from './utils/getTruncatedOptions';
import typeaheadContainer from './containers/typeaheadContainer';

class Typeahead extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {allowNew, onInitialItemChange, results} = nextProps;

    // Clear the initial item when there are no results.
    if (!(allowNew || results.length)) {
      onInitialItemChange(null);
    }
  }

  render() {
    const {
      allowNew,
      className,
      dropup,
      labelKey,
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
        className={cx('rbt', 'rbt-container', 'clearfix', 'open', {
          'dropup': dropup,
        }, className)}
        style={{position: 'relative'}}>
        {this._renderInput(results)}
        {this._renderAux()}
        {this._renderMenu(results, shouldPaginate)}
      </div>
    );
  }

  blur = () => {
    this._input.blur();
  }

  focus = () => {
    this._input.focus();
  }

  _renderInput = results => {
    const {
      activeIndex,
      activeItem,
      bsSize,
      disabled,
      initialItem,
      labelKey,
      minLength,
      multiple,
      name,
      onBlur,
      onFocus,
      onInputChange,
      onKeyDown,
      onSelectionAdd,
      onSelectionRemove,
      placeholder,
      renderToken,
      selected,
      text,
    } = this.props;

    const Input = multiple ? TokenizerInput : TypeaheadInput;

    return (
      <Input
        activeIndex={activeIndex}
        activeItem={activeItem}
        bsSize={bsSize}
        disabled={disabled}
        hasAux={!!this._renderAux()}
        hintText={getHintText({
          activeItem,
          initialItem,
          labelKey,
          minLength,
          selected,
          text,
        })}
        initialItem={initialItem}
        labelKey={labelKey}
        name={name}
        onAdd={onSelectionAdd}
        onBlur={onBlur}
        onChange={onInputChange}
        onFocus={onFocus}
        onKeyDown={e => onKeyDown(results, e)}
        onRemove={onSelectionRemove}
        options={results}
        placeholder={placeholder}
        ref={input => this._input = input}
        renderToken={renderToken}
        selected={selected.slice()}
        value={getInputText({activeItem, labelKey, multiple, selected, text})}
      />
    );
  }

  _renderMenu = (results, shouldPaginate) => {
    const {
      align,
      bodyContainer,
      dropup,
      emptyLabel,
      labelKey,
      maxHeight,
      minLength,
      newSelectionPrefix,
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

    const menu = renderMenu ?
      renderMenu(results, menuProps) :
      <TypeaheadMenu
        {...menuProps}
        options={results}
        renderMenuItemChildren={renderMenuItemChildren}
      />;

    return (
      <Overlay
        container={bodyContainer ? document.body : this}
        show={showMenu && text.length >= minLength}
        target={() => this._input}>
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
      return <Loader bsSize={bsSize} />;
    }

    if (clearButton && !disabled && selected.length) {
      return (
        <ClearButton
          bsSize={bsSize}
          className="rbt-clear-button"
          onClick={onClear}
        />
      );
    }
  }
}

export default typeaheadContainer(Typeahead);
