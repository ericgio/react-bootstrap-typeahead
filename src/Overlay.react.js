import cx from 'classnames';
import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {componentOrElement} from 'prop-types-extra';
import {Portal} from 'react-overlays';
import {Popper} from 'react-popper';

const BODY_CLASS = 'rbt-body-container';
const a11yStatusDelay = 170; // milliseconds

// When appending the overlay to `document.body`, clicking on it will register
// as an "outside" click and immediately close the overlay. This classname tells
// `react-onclickoutside` to ignore the click.
const IGNORE_CLICK_OUTSIDE = 'ignore-react-onclickoutside';

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

  componentWillReceiveProps(nextProps) {
    const {
      a11yStatusContainerId,
      a11yStatus,
      multiple,
      onMenuHide,
      onMenuShow,
      resultsCount,
      selectionCount,
      show
    } = nextProps;

    if (this.props.show && !show) {
      onMenuHide();
      //updateA11yStatus();
    }

    if (!this.props.show && show) {
      onMenuShow();
      updateA11yStatus(true);
    }

    if (this.props.resultsCount !== nextProps.resultsCount)
      updateA11yStatus();

    function updateA11yStatus (menuShow = false) {
      setTimeout (() => {
        let container = document.getElementById(a11yStatusContainerId);
        if (container) container.textContent =
          a11yStatus(resultsCount, multiple, selectionCount, menuShow);
      }, a11yStatusDelay);
    }

    // Remove scoping classes if menu isn't being appended to document body.
    const {className, container} = this.props;
    if (isBody(container) && !isBody(nextProps.container)) {
      container.classList.remove(BODY_CLASS);
      !!className && container.classList.remove(...className.split(' '));
    }

    this._update();
  }

  render() {
    const {align, children, container, dropup, show, target} = this.props;

    if (!(show && Children.count(children) && target)) {
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
          target={target}>
          {(props) => {
            const {ref, ...popperProps} = props.popperProps;
            return cloneElement(child, {
              ...child.props,
              ...popperProps,
              className: cx(child.props.className, {
                [IGNORE_CLICK_OUTSIDE]: isBody(container),
              }),
              innerRef: ref,
            });
          }}
        </Popper>
      </Portal>
    );
  }

  _update = () => {
    const {className, container, show} = this.props;

    // Positioning is only used when body is the container.
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
  onMenuHide: PropTypes.func.isRequired,
  onMenuShow: PropTypes.func.isRequired,
  show: PropTypes.bool,
  target: componentOrElement,
};

Overlay.defaultProps = {
  show: false,
};

export default Overlay;
