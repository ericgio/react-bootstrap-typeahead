import {noop} from 'lodash';
import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {componentOrElement} from 'prop-types-extra';
import {Portal} from 'react-overlays';
import {Popper} from 'react-popper';

const BODY_CLASS = 'rbt-body-container';

function getModifiers({align, flip}) {
  return {
    computeStyles: {
      enabled: true,
      fn: (data) => {
        // Use the following condition instead of `align === 'justify'` since
        // it allows the component to fall back to justifying the menu width
        // even when `align` is undefined.
        if (align !== 'right' && align !== 'left') {
          // Set the popper width to match the target width.
          data.styles.width = data.offsets.reference.width;
        }
        return data;
      },
    },
    flip: {
      enabled: flip,
    },
    preventOverflow: {
      escapeWithReference: true,
    },
  };
}

function isBody(container) {
  return container === document.body;
}

/**
 * Custom `Overlay` component, since the version in `react-overlays` doesn't
 * work for our needs. Specifically, the `Position` component doesn't provide
 * the customized placement we need.
 */
class Overlay extends React.Component {
  componentDidMount() {
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    const {onMenuHide, onMenuShow, onMenuToggle, show} = this.props;

    if (show !== prevProps.show) {
      show ? onMenuShow() : onMenuHide();
      onMenuToggle(show);
    }

    // Remove scoping classes if menu isn't being appended to document body.
    const {className, container} = prevProps;
    if (isBody(container) && !isBody(this.props.container)) {
      container.classList.remove(BODY_CLASS);
      !!className && container.classList.remove(...className.split(' '));
    }

    this._update();
  }

  render() {
    const {
      align,
      children,
      container,
      dropup,
      referenceElement,
      show,
    } = this.props;

    if (!(show && Children.count(children))) {
      return null;
    }

    const child = Children.only(children);

    const xPlacement = align === 'right' ? 'end' : 'start';
    const yPlacement = dropup ? 'top' : 'bottom';

    return (
      <Portal container={container}>
        <Popper
          modifiers={getModifiers(this.props)}
          placement={`${yPlacement}-${xPlacement}`}
          referenceElement={referenceElement}>
          {({ref, ...props}) => cloneElement(child, {
            ...child.props,
            ...props,
            innerRef: ref,
            inputHeight: referenceElement ? referenceElement.offsetHeight : 0,
          })}
        </Popper>
      </Portal>
    );
  }

  _update = () => {
    const {className, container, show} = this.props;

    if (!(show && isBody(container))) {
      return;
    }

    // Set a classname on the body for scoping purposes.
    container.classList.add(BODY_CLASS);
    !!className && container.classList.add(...className.split(' '));
  }
}

Overlay.propTypes = {
  children: PropTypes.element,
  container: componentOrElement.isRequired,
  onMenuHide: PropTypes.func,
  onMenuShow: PropTypes.func,
  onMenuToggle: PropTypes.func,
  referenceElement: componentOrElement,
  show: PropTypes.bool,
};

Overlay.defaultProps = {
  onMenuHide: noop,
  onMenuShow: noop,
  onMenuToggle: noop,
  show: false,
};

export default Overlay;
