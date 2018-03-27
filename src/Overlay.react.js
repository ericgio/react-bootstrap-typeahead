import cx from 'classnames';
import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {Portal} from 'react-overlays';
import {componentOrElement} from 'prop-types-extra';

const BODY_CLASS = 'rbt-body-container';

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
  componentDidMount() {
    this._update();
  }

  componentWillReceiveProps(nextProps) {
    const {onMenuHide, onMenuShow, show} = nextProps;

    if (this.props.show && !show) {
      onMenuHide();
    }

    if (!this.props.show && show) {
      onMenuShow();
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
    const {children, container, show} = this.props;

    if (!(show && Children.count(children))) {
      return null;
    }

    let child = Children.only(children);

    if (!isBody(container)) {
      return child;
    }

    child = cloneElement(child, {
      ...child.props,
      className: cx(child.props.className, IGNORE_CLICK_OUTSIDE),
    });

    return (
      <Portal container={container}>
        {child}
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
};

Overlay.defaultProps = {
  show: false,
};

export default Overlay;
