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

import TypeaheadManager from './base/TypeaheadManager';
import {getAccessibilityStatus, preventInputBlur} from './utils';

class Typeahead extends React.Component {
  render() {
    const {children, className, renderMenu} = this.props;

    return (
      <TypeaheadManager
        {...this.props}
        ref={(instance) => this._instance = instance}>
        {(props) => {
          const {
            bodyContainer,
            isMenuShown,
            menuId,
            results,
          } = props;

          const overlayProps = pick(props, [
            'align',
            'className',
            'dropup',
            'flip',
            'onMenuHide',
            'onMenuShow',
            'onMenuToggle',
          ]);

          const menuProps = pick(props, [
            'emptyLabel',
            'labelKey',
            'maxHeight',
            'newSelectionPrefix',
            'renderMenuItemChildren',
            'text',
          ]);

          const auxContent = this._renderAux(props);

          return (
            <div
              className={cx('rbt', 'clearfix', 'open', {
                'has-aux': !!auxContent,
              }, className)}
              style={{position: 'relative'}}
              tabIndex={-1}>
              {this._renderInput(props)}
              {typeof children === 'function' ? children(props) : children}
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
                {getAccessibilityStatus(props)}
              </div>
            </div>
          );
        }}
      </TypeaheadManager>
    );
  }

  getInstance = () => {
    return this._instance;
  }

  _renderInput = (props) => {
    const inputProps = pick(props, [
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
      'placeholder',
      'renderToken',
      'selected',
      'text',
    ]);

    // Use `findDOMNode` here since it's easier and less fragile than
    // forwarding refs down to the input's container.
    // TODO: Consider using `forwardRef` when React 16.3 usage is higher.
    /* eslint-disable-next-line react/no-find-dom-node */
    inputProps.ref = (node) => this._inputContainer = findDOMNode(node);

    const Input = props.multiple ?
      TypeaheadInputMulti :
      TypeaheadInputSingle;

    return <Input {...inputProps} />;
  }

  _renderAux = (props) => {
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

Typeahead.propTypes = {
  renderMenu: PropTypes.func,
};

Typeahead.defaultProps = {
  renderMenu: (results, menuProps) => (
    <TypeaheadMenu {...menuProps} options={results} />
  ),
};

export default Typeahead;
