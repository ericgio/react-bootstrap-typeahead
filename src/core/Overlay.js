import {noop} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {componentOrElement} from 'prop-types-extra';
import {Popper} from 'react-popper';

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
          /* eslint-disable-next-line no-param-reassign */
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

class Overlay extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    const {onMenuHide, onMenuShow, onMenuToggle, show} = this.props;

    if (show !== prevProps.show) {
      show ? onMenuShow() : onMenuHide();
      onMenuToggle(show);
    }
  }

  render() {
    const {
      align,
      children,
      dropup,
      positionFixed,
      referenceElement,
      show,
    } = this.props;

    if (!show) {
      return null;
    }

    const xPlacement = align === 'right' ? 'end' : 'start';
    const yPlacement = dropup ? 'top' : 'bottom';

    return (
      <Popper
        modifiers={getModifiers(this.props)}
        placement={`${yPlacement}-${xPlacement}`}
        positionFixed={positionFixed}
        referenceElement={referenceElement}>
        {({ref, ...props}) => children({
          ...props,
          innerRef: ref,
          inputHeight: referenceElement ? referenceElement.offsetHeight : 0,
        })}
      </Popper>
    );
  }
}

Overlay.propTypes = {
  children: PropTypes.func.isRequired,
  onMenuHide: PropTypes.func,
  onMenuShow: PropTypes.func,
  onMenuToggle: PropTypes.func,
  positionFixed: PropTypes.bool,
  referenceElement: componentOrElement,
  show: PropTypes.bool,
};

Overlay.defaultProps = {
  onMenuHide: noop,
  onMenuShow: noop,
  onMenuToggle: noop,
  positionFixed: false,
  show: false,
};

export default Overlay;
