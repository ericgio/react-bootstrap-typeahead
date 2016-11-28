import cx from 'classnames';
import React, {Children, cloneElement, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {Portal} from 'react-overlays';
import componentOrElement from 'react-prop-types/lib/componentOrElement';

// When appending the overlay to `document.body`, clicking on it will register
// as an "outside" click and immediately close the overlay. This classname tells
// `react-onclickoutside` to ignore the click.
const IGNORE_CLICK_OUTSIDE = 'ignore-react-onclickoutside';

/**
 * Custom `Overlay` component, since the version in `react-overlays` doesn't
 * work for our needs. Specifically, the `Position` component doesn't provide
 * the customized placement we need.
 */
const Overlay = React.createClass({
  displayName: 'Overlay',

  propTypes: {
    container: PropTypes.oneOfType([
      componentOrElement,
      PropTypes.func,
    ]).isRequired,
    show: PropTypes.bool,
    target: PropTypes.oneOfType([
      componentOrElement,
      PropTypes.func,
    ]).isRequired,
  },

  getDefaultProps() {
    return {
      show: false,
    };
  },

  getInitialState() {
    return {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };
  },

  componentDidMount() {
    this._updatePosition();
    window.addEventListener('resize', this._updatePosition);
  },

  componentWillReceiveProps(nextProps) {
    this._updatePosition();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._updatePosition);
  },

  render() {
    if (!this.props.show) {
      return null;
    }

    const {container, children} = this.props;

    let child = Children.only(children);
    if (container === document.body) {
      child = cloneElement(child, {
        ...child.props,
        className: cx(child.props.className, IGNORE_CLICK_OUTSIDE),
        style: this.state,
      });
    }

    return (
      <Portal container={container}>
        {child}
      </Portal>
    );
  },

  _updatePosition() {
    const targetNode = findDOMNode(this.props.target());

    if (targetNode) {
      const {innerHeight, innerWidth, pageYOffset} = window;
      const {bottom, left, top, width} = targetNode.getBoundingClientRect();

      this.setState({
        bottom: innerHeight - pageYOffset - top,
        left,
        right: innerWidth - left - width,
        top: pageYOffset + bottom,
      });
    }
  },
});

export default Overlay;
