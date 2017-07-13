import cx from 'classnames';
import React from 'react';

import Overlay from './Overlay.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import addCustomOption from './utils/addCustomOption';
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
      onInputChange,
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
        className={cx('rbt', 'rbt-container', 'clearfix', 'open', {
          'dropup': dropup,
        }, className)}
        style={{position: 'relative'}}>
        <TypeaheadInput
          {...this.props}
          onAdd={onSelectionAdd}
          onChange={onInputChange}
          onKeyDown={e => onKeyDown(results, e)}
          onRemove={onSelectionRemove}
          options={results}
          ref={input => this._input = input}
        />
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
}

export default typeaheadContainer(Typeahead);
