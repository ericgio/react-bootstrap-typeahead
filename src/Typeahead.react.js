import cx from 'classnames';
import React from 'react';

import Overlay from './Overlay.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import typeaheadContainer from './containers/typeaheadContainer';
import {addCustomOption, getAccessibilityStatus, getTruncatedOptions} from './utils/';

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
      className,
      dropup,
      emptyLabel,
      labelKey,
      minLength,
      onInputChange,
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
      (results.length || emptyLabel)
    );

    return (
      <div
        className={cx('rbt', 'open', 'clearfix', {'dropup': dropup}, className)}
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
        {this._renderMenu(results, shouldPaginate, menuVisible)}
        <div
          aria-atomic={true}
          aria-live="polite"
          className="sr-only rbt-sr-status"
          role="status">
          {getAccessibilityStatus(results, menuVisible, this.props)}
        </div>
      </div>
    );
  }

  getInputNode() {
    return this._input.getInputNode();
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
      onPaginate,
      paginate: shouldPaginate,
      paginationText,
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
}

export default typeaheadContainer(Typeahead);
