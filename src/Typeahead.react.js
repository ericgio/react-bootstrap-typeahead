import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Overlay from './Overlay.react';
import TypeaheadInput from './TypeaheadInput.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import typeaheadContainer from './containers/typeaheadContainer';
import {getAccessibilityStatus} from './utils/';

class Typeahead extends React.Component {
  render() {
    const {
      align,
      bodyContainer,
      className,
      dropup,
      emptyLabel,
      inputRef,
      isMenuShown,
      labelKey,
      maxHeight,
      menuId,
      newSelectionPrefix,
      onInputChange,
      onMenuHide,
      onMenuShow,
      onSelectionAdd,
      onSelectionRemove,
      renderMenu,
      renderMenuItemChildren,
      results,
      text,
    } = this.props;

    const menuProps = {
      align,
      dropup,
      emptyLabel,
      id: menuId,
      labelKey,
      maxHeight,
      newSelectionPrefix,
      renderMenuItemChildren,
      text,
    };

    return (
      <div
        className={cx('rbt', 'open', 'clearfix', {'dropup': dropup}, className)}
        style={{position: 'relative'}}
        tabIndex={-1}>
        <TypeaheadInput
          {...this.props}
          onAdd={onSelectionAdd}
          onChange={onInputChange}
          onRemove={onSelectionRemove}
          options={results}
          ref={inputRef}
        />
        <Overlay
          align={align}
          className={className}
          container={bodyContainer ? document.body : this}
          dropup={dropup}
          onMenuHide={onMenuHide}
          onMenuShow={onMenuShow}
          show={isMenuShown}
          target={this}>
          {renderMenu(results, menuProps)}
        </Overlay>
        <div
          aria-atomic={true}
          aria-live="polite"
          className="sr-only rbt-sr-status"
          role="status">
          {getAccessibilityStatus(this.props)}
        </div>
      </div>
    );
  }
}

Typeahead.propTypes = {
  renderMenu: PropTypes.func,
};

Typeahead.defaultProps = {
  renderMenu: (results, menuProps) => (
    <TypeaheadMenu {...menuProps} options={results} />
  ),
};

export default typeaheadContainer(Typeahead);
