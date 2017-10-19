import cx from 'classnames';
import {isEqual} from 'lodash';
import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import {Portal} from 'react-overlays';
import componentOrElement from 'prop-types-extra/lib/componentOrElement';

const DROPUP_SPACING = -4;

// When appending the overlay to `document.body`, clicking on it will register
// as an "outside" click and immediately close the overlay. This classname tells
// `react-onclickoutside` to ignore the click.
const IGNORE_CLICK_OUTSIDE = 'ignore-react-onclickoutside';

function isBody(container) {
  return container === document.body;
}

/**
 * Custom `Overlay` component, since the version in `react-overlays` doesn't
 * work for our needs. Specifically, the `Position` component doesn't provide
 * the customized placement we need.
 */
class Overlay extends React.Component {
  displayName = 'Overlay';

  state = {
    left: 0,
    right: 0,
    top: 0,
  };

  componentDidMount() {
    this._mounted = true;
    this._update();

    this._updateThrottled = requestAnimationFrame.bind(null, this._update);

    window.addEventListener('resize', this._updateThrottled);
    window.addEventListener('scroll', this._updateThrottled, true);
  }

  componentWillReceiveProps(nextProps) {
    const {onMenuHide, onMenuShow, show} = nextProps;

    if (this.props.show && !show) {
      onMenuHide();
    }

    if (!this.props.show && show) {
      onMenuShow();
    }

    this._updateThrottled();
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener('resize', this._updateThrottled);
    window.removeEventListener('scroll', this._updateThrottled);
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    const {container, children} = this.props;
    let child = Children.only(children);

    // When not attaching the overlay to `document.body` treat the child as a
    // simple inline element.
    if (!isBody(container)) {
      return child;
    }

    child = cloneElement(child, {
      ...child.props,
      className: cx(child.props.className, IGNORE_CLICK_OUTSIDE),
      style: this.state,
    });

    return (
      <Portal container={container} ref={(portal) => this._portal = portal}>
        {child}
      </Portal>
    );
  }

  _update = () => {
    const {className, container, show} = this.props;

    // Positioning is only used when body is the container.
    if (!(show && isBody(container) && this._mounted && this._portal)) {
      return;
    }

    const mountNode = this._portal.getMountNode();
    if (mountNode) {
      mountNode.className = cx('rbt-body-container', className);
    }

    this._updatePosition();
  }

  _updatePosition = () => {
    const {align, dropup, target} = this.props;

    const menuNode = this._portal.getOverlayDOMNode();
    const targetNode = findDOMNode(target);

    if (menuNode && targetNode) {
      const {innerWidth, pageYOffset} = window;
      const {bottom, left, top, width} = targetNode.getBoundingClientRect();

      const newState = {
        left: align === 'right' ? 'auto' : left,
        right: align === 'left' ? 'auto' : innerWidth - left - width,
        top: dropup ?
          pageYOffset - menuNode.offsetHeight + top + DROPUP_SPACING :
          pageYOffset + bottom,
      };

      // Don't update unless the target element position has changed.
      if (!isEqual(this.state, newState)) {
        this.setState(newState);
      }
    }
  }
}

Overlay.propTypes = {
  container: componentOrElement.isRequired,
  onMenuHide: PropTypes.func.isRequired,
  onMenuShow: PropTypes.func.isRequired,
  show: PropTypes.bool,
  target: componentOrElement.isRequired,
};

Overlay.defaultProps = {
  show: false,
};

export default Overlay;
