import cx from 'classnames';
import {pick} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Overlay from './Overlay.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import typeaheadContainer from './containers/typeaheadContainer';
import {preventInputBlur} from './utils/';

function a11yStatus(resultsCount, multiple, selectionCount, menuShow) {
  if (resultsCount === 0) return 'no results.';
  let instructions = 'use up and down arrows to navigate';
  let statusText =
    `${resultsCount} ${resultsCount > 1? 'results' : 'result'}`;
  if (multiple && selectionCount > 0)
    statusText = `${statusText}, ${selectionCount} selected`;
  if (menuShow)
    statusText = `${statusText}, ${instructions}`;
  return `${statusText}.`;
} // a11yStatus

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
      a11yStatusContainerId,
      bodyContainer,
      className,
      isMenuShown,
      menuId,
      multiple,
      renderMenu,
      results,
      selected,
    } = this.props;

    const inputProps = pick(this.props, [
      'activeIndex',
      'activeItem',
      'bsSize',
      'disabled',
      'initialItem',
      'inputProps',
      'inputRef',
      'isMenuShown',
      'labelKey',
      'menuId',
      'multiple',
      'onAdd',
      'onBlur',
      'onChange',
      'onFocus',
      'onKeyDown',
      'onRemove',
      'placeholder',
      'renderToken',
      'selected',
      'selectHintOnEnter',
      'text',
    ]);

    const overlayProps = pick(this.props, [
      'align',
      'className',
      'dropup',
      'flip',
      'onMenuHide',
      'onMenuShow',
    ]);

    const menuProps = pick(this.props, [
      'emptyLabel',
      'labelKey',
      'maxHeight',
      'multiple',
      'newSelectionPrefix',
      'renderMenuItemChildren',
      'results',
      'selected',
      'text',
    ]);

    const auxContent = this._renderAux();

    return (
      <div
        className={cx('rbt', 'clearfix', 'open', {
          'has-aux': !!auxContent,
        }, className)}
        ref={(target) => this._target = target}
        style={{position: 'relative'}}
        tabIndex={-1}>
        {this._renderInput(inputProps)}
        {auxContent}
        <Overlay
          {...overlayProps}
          a11yStatus={a11yStatus}
          a11yStatusContainerId={a11yStatusContainerId}
          container={bodyContainer ? document.body : this}
          multiple={multiple}
          resultsCount={results.length}
          selectionCount={selected.length}
          show={isMenuShown}
          target={this._target}>
          {renderMenu(results, {...menuProps, id: menuId})}
        </Overlay>
        <div
          aria-atomic={true}
          aria-live="polite"
          className="sr-only rbt-sr-status"
          id={a11yStatusContainerId}>
        </div>
      </div>
    );
  }

  _renderInput = (inputProps) => {
    const Input = inputProps.multiple ?
      TypeaheadInputMulti :
      TypeaheadInputSingle;

    return <Input {...inputProps} />;
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

Typeahead.propTypes = {
  renderMenu: PropTypes.func,
};

Typeahead.defaultProps = {
  renderMenu: (results, menuProps) => (
    <TypeaheadMenu
      {...menuProps}
      onMenuChange={() => {
        const {a11yStatusContainerId, multiple, results, selected} = menuProps;
        let container = document.getElementById (a11yStatusContainerId);
        if (container) container.textContent =
          a11yStatus (results.length, multiple, selected.length);
      }}
      options={results}
    />
  ),
};

export default typeaheadContainer(Typeahead);
