import cx from 'classnames';
import {isEqual} from 'lodash';
import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import {Portal} from 'react-overlays';
import componentOrElement from 'react-prop-types/lib/componentOrElement';

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

  constructor(props) {
    super(props);

    this.state = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };
  }

  componentDidMount() {
    this._mounted = true;
    this._updatePosition();

    this._updatePositionThrottled = requestAnimationFrame.bind(
      null,
      this._updatePosition,
    );

    window.addEventListener('resize', this._updatePositionThrottled);
    window.addEventListener('scroll', this._updatePositionThrottled, true);
  }

  componentWillReceiveProps(nextProps) {
    const {onMenuHide, onMenuShow, show} = nextProps;

    if (this.props.show && !show) {
      onMenuHide();
    }

    if (!this.props.show && show) {
      onMenuShow();
    }

    this._updatePositionThrottled();
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener('resize', this._updatePositionThrottled);
    window.removeEventListener('scroll', this._updatePositionThrottled);
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
      <Portal container={container}>
        {child}
      </Portal>
    );
  }

  _updatePosition = () => {
    const {container, show, target} = this.props;

    // Positioning is only used when body is the container.
    if (!(show && this._mounted && isBody(container))) {
      return;
    }

    const targetNode = findDOMNode(target);

    if (targetNode) {
      const {innerHeight, innerWidth, pageYOffset} = window;
      const {bottom, left, top, width} = targetNode.getBoundingClientRect();
      const newState = {
        bottom: innerHeight - pageYOffset - top,
        left,
        right: innerWidth - left - width,
        top: pageYOffset + bottom,
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
