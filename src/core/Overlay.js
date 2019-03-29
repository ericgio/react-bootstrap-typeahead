// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import { noop } from '../utils';
import type { ReferenceElement } from '../types';

export type OverlayProps = {
  align: 'justify' | 'left' | 'right',
  children: Function,
  dropup: boolean,
  flip: boolean,
  onMenuToggle: (boolean) => void,
  positionFixed: boolean,
  referenceElement: ?ReferenceElement,
  show: boolean,
};

const propTypes = {
  /**
   * Specify menu alignment. The default value is `justify`, which makes the
   * menu as wide as the input and truncates long values. Specifying `left`
   * or `right` will align the menu to that side and the width will be
   * determined by the length of menu item values.
   */
  align: PropTypes.oneOf(['justify', 'left', 'right']),
  children: PropTypes.func.isRequired,
  /**
   * Specify whether the menu should appear above the input.
   */
  dropup: PropTypes.bool,
  /**
   * Whether or not to automatically adjust the position of the menu when it
   * reaches the viewport boundaries.
   */
  flip: PropTypes.bool, /* eslint-disable-line react/no-unused-prop-types */
  /**
   * Invoked when menu visibility changes.
   */
  onMenuToggle: PropTypes.func,
  positionFixed: PropTypes.bool,
  /* eslint-disable-next-line react/forbid-prop-types */
  referenceElement: PropTypes.object,
  show: PropTypes.bool,
};

const defaultProps = {
  align: 'justify',
  dropup: false,
  flip: false,
  onMenuToggle: noop,
  positionFixed: false,
  show: false,
};

function getModifiers({ align, flip }: OverlayProps) {
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

class Overlay extends React.Component<OverlayProps> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  componentDidUpdate(prevProps: OverlayProps) {
    const { onMenuToggle, show } = this.props;

    if (show !== prevProps.show) {
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
        {({ ref, ...props }) => children({
          ...props,
          innerRef: ref,
          inputHeight: referenceElement ? referenceElement.offsetHeight : 0,
        })}
      </Popper>
    );
  }
}

export default Overlay;
