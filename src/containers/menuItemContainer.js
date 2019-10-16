// @flow

import scrollIntoView from 'scroll-into-view-if-needed';
import React, { type ComponentType } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import { withContext } from '../core/Context';
import { getDisplayName, getMenuItemId, preventInputBlur } from '../utils';

import type { Option } from '../types';

const propTypes = {
  option: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  position: PropTypes.number,
};

type Props = {
  option: Option,
  position: number,
};

const menuItemContainer = (Component: ComponentType<*>) => {
  class WrappedMenuItem extends React.Component<* & Props> {
    static displayName = `menuItemContainer(${getDisplayName(Component)})`;
    static propTypes = propTypes;

    componentDidMount() {
      this._maybeUpdateItem();
    }

    componentDidUpdate(prevProps, prevState) {
      this._maybeUpdateItem();
    }

    render() {
      const {
        activeIndex,
        id,
        isOnlyResult,
        items,
        label,
        onActiveItemChange,
        onInitialItemChange,
        onMenuItemClick,
        option,
        position,
        ...props
      } = this.props;

      const active = isOnlyResult || activeIndex === position;

      // Update the item's position in the item stack on each render.
      items[position] = option;

      return (
        <Component
          {...props}
          active={active}
          aria-label={label}
          aria-selected={active}
          id={getMenuItemId(id, position)}
          onClick={this._handleClick}
          onMouseDown={preventInputBlur}
          role="option"
        />
      );
    }

    _handleClick = (e) => {
      const { onMenuItemClick, option, onClick } = this.props;

      onMenuItemClick(option, e);
      onClick && onClick(e);
    }

    _maybeUpdateItem = () => {
      const {
        activeIndex,
        onActiveItemChange,
        onInitialItemChange,
        option,
        position,
      } = this.props;

      if (position === 0) {
        onInitialItemChange(option);
      }

      if (position === activeIndex) {
        onActiveItemChange(option);

        // Automatically scroll the menu as the user keys through it.
        /* eslint-disable-next-line react/no-find-dom-node */
        const node = findDOMNode(this);
        node && scrollIntoView(node, {
          block: 'nearest',
          boundary: node.parentNode,
          inline: 'nearest',
          scrollMode: 'if-needed',
        });
      }
    }
  }

  return withContext(WrappedMenuItem, [
    'activeIndex',
    'id',
    'isOnlyResult',
    'items',
    'onActiveItemChange',
    'onInitialItemChange',
    'onMenuItemClick',
  ]);
};

export default menuItemContainer;
