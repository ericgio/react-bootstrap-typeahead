// @flow

import { noop } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { componentOrElement } from 'prop-types-extra';
import { Popper } from 'react-popper';

import type { Align } from '../types';

type Props = {
  align: Align,
  children: Function,
  dropup: boolean,
  flip: boolean, /* eslint-disable-line react/no-unused-prop-types */
  onMenuToggle: (boolean) => void,
  positionFixed: boolean,
  referenceElement: ?HTMLElement,
  show: boolean,
};

function getModifiers({ align, flip }: Props) {
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

const propTypes = {
  children: PropTypes.func.isRequired,
  onMenuToggle: PropTypes.func,
  positionFixed: PropTypes.bool,
  referenceElement: componentOrElement,
  show: PropTypes.bool,
};

const defaultProps = {
  onMenuToggle: noop,
  positionFixed: false,
  show: false,
};

class Overlay extends React.Component<Props> {
  static propTypes: Object;
  static defaultProps: Object;

  componentDidUpdate(prevProps: Props) {
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

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
