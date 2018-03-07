import cx from 'classnames';
import {pick} from 'lodash';
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
      inputRef,
      isMenuShown,
      menuId,
      onInputChange,
      onMenuHide,
      onMenuShow,
      onSelectionAdd,
      onSelectionRemove,
      renderMenu,
      results,
    } = this.props;

    const inputProps = {
      ...pick(this.props, [
        'activeIndex',
        'activeItem',
        'bsSize',
        'clearButton',
        'disabled',
        'initialItem',
        'inputProps',
        'isLoading',
        'isMenuShown',
        'labelKey',
        'menuId',
        'minLength',
        'multiple',
        'onBlur',
        'onClear',
        'onFocus',
        'onKeyDown',
        'placeholder',
        'renderToken',
        'selected',
        'selectHintOnEnter',
        'text',
      ]),
      onAdd: onSelectionAdd,
      onChange: onInputChange,
      onRemove: onSelectionRemove,
      ref: inputRef,
    };

    const menuProps = {
      ...pick(this.props, [
        'align',
        'dropup',
        'emptyLabel',
        'labelKey',
        'maxHeight',
        'newSelectionPrefix',
        'renderMenuItemChildren',
        'text',
      ]),
      id: menuId,
    };

    return (
      <div
        className={cx('rbt', 'open', 'clearfix', {'dropup': dropup}, className)}
        style={{position: 'relative'}}
        tabIndex={-1}>
        {this._renderInput(inputProps)}
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

  _renderInput = (inputProps) => {
    return <TypeaheadInput {...inputProps} />;
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
