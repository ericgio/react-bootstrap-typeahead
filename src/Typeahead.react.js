import cx from 'classnames';
import {pick} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

import ClearButton from './ClearButton.react';
import Loader from './Loader.react';
import Overlay from './Overlay.react';
import TypeaheadInputMulti from './TypeaheadInputMulti.react';
import TypeaheadInputSingle from './TypeaheadInputSingle.react';
import TypeaheadMenu from './TypeaheadMenu.react';

import typeaheadContainer from './containers/typeaheadContainer';
import {getAccessibilityStatus, preventInputBlur} from './utils';

class Typeahead extends React.Component {
  render() {
    const {
      bodyContainer,
      children,
      className,
      isMenuShown,
      menuId,
      renderMenu,
      results,
    } = this.props;

    const inputProps = pick(this.props, [
      'activeIndex',
      'activeItem',
      'bsSize',
      'disabled',
      'inputProps',
      'inputRef',
      'isFocused',
      'isInvalid',
      'isMenuShown',
      'isValid',
      'labelKey',
      'menuId',
      'multiple',
      'onBlur',
      'onChange',
      'onFocus',
      'onKeyDown',
      'onRemove',
      'onTokenFocus',
      'placeholder',
      'renderToken',
      'selected',
      'text',
    ]);

    const overlayProps = pick(this.props, [
      'align',
      'className',
      'dropup',
      'flip',
      'onMenuHide',
      'onMenuShow',
      'onMenuToggle',
    ]);

    const menuProps = pick(this.props, [
      'emptyLabel',
      'labelKey',
      'maxHeight',
      'newSelectionPrefix',
      'renderMenuItemChildren',
      'text',
    ]);

    const auxContent = this._renderAux();

    return (
      <div
        className={cx('rbt', 'clearfix', 'open', {
          'has-aux': !!auxContent,
        }, className)}
        style={{position: 'relative'}}
        tabIndex={-1}>
        {this._renderInput({
          ...inputProps,
          // Use `findDOMNode` here since it's easier and less fragile than
          // forwarding refs down to the input's container.
          // TODO: Consider using `forwardRef` when React 16.3 usage is higher.
          /* eslint-disable-next-line react/no-find-dom-node */
          ref: (node) => this._inputContainer = findDOMNode(node),
        })}
        {typeof children === 'function' ? children(this.props) : children}
        {auxContent}
        <Overlay
          {...overlayProps}
          container={bodyContainer ? document.body : this}
          referenceElement={this._inputContainer}
          show={isMenuShown}>
          {renderMenu(results, {...menuProps, id: menuId})}
        </Overlay>
        <div
          aria-atomic
          aria-live="polite"
          className="sr-only rbt-sr-status"
          role="status">
          {getAccessibilityStatus(this.props)}
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
    <TypeaheadMenu {...menuProps} options={results} />
  ),
};

export default typeaheadContainer(Typeahead);
