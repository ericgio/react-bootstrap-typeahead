import { mount } from 'enzyme';
import React from 'react';

import Token from '../../components/Token';
import { BACKSPACE, RETURN } from '../../constants';

const option = {
  label: 'test option',
};

function getCloseButton(wrapper) {
  return wrapper.find('.rbt-token-remove-button').hostNodes();
}

function isActive(wrapper) {
  return wrapper.find('.rbt-token').hasClass('rbt-token-active');
}

function isDisabled(wrapper) {
  return wrapper.find('div').hasClass('rbt-token-disabled');
}

function isRemoveable(wrapper) {
  return (
    wrapper.find('.rbt-token').hasClass('rbt-token-removeable') &&
    getCloseButton(wrapper).length === 1
  );
}

describe('<Token>', () => {
  let token;

  beforeEach(() => {
    token = mount(<Token option={option}>This is a token</Token>);
  });

  it('renders a basic token', () => {
    expect(token.find('div').hasClass('rbt-token')).toBe(true);
    expect(token.text()).toBe('This is a token');
  });

  describe('renders a non-removeable token', () => {
    afterEach(() => {
      expect(isRemoveable(token)).toBe(false);
    });

    it('when no `onRemove` function is passed in', () => {
      token.setProps({ onRemove: undefined });
    });

    it('when the token is disabled', () => {
      token.setProps({ disabled: true });
      expect(isDisabled(token)).toBe(true);
    });

    it('when the token is read-only', () => {
      token.setProps({ readOnly: true });
    });
  });

  it('renders a removeable token', () => {
    const onRemove = jest.fn();

    token.setProps({ onRemove });

    expect(isRemoveable(token)).toBe(true);

    const closeButton = getCloseButton(token);
    closeButton.simulate('click');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders a token with an href', () => {
    const href = '#someHref';
    token.setProps({ href });

    const anchor = token.find('a');
    expect(anchor).toHaveLength(1);
    expect(anchor.hasClass('rbt-token')).toBe(true);
    expect(anchor.prop('href')).toBe(href);
  });

  it('makes disabled tokens non-interactive', () => {
    token.setProps({
      disabled: true,
      href: '#somehref',
    });

    expect(token.find('div')).toHaveLength(1);
    expect(token.find('a')).toHaveLength(0);
    expect(isDisabled(token)).toBe(true);
  });

  describe('event handlers', () => {
    let mockEvent, onBlur, onClick, onFocus, onRemove, stopPropagation;

    beforeEach(() => {
      onBlur = jest.fn();
      onClick = jest.fn();
      onFocus = jest.fn();
      onRemove = jest.fn();
      stopPropagation = jest.fn();
      mockEvent = { stopPropagation };

      token = mount(
        <Token
          onBlur={onBlur}
          onClick={onClick}
          onFocus={onFocus}
          onRemove={onRemove}
          option={option}>
          This is a token
        </Token>
      );

      expect(isActive(token)).toBe(false);
    });

    it('handles click events', () => {
      token.simulate('click', mockEvent);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(stopPropagation).toHaveBeenCalledTimes(1);
      expect(isActive(token)).toBe(true);
    });

    it('handles focus events', () => {
      token.simulate('focus', mockEvent);

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(stopPropagation).toHaveBeenCalledTimes(1);
      expect(isActive(token)).toBe(true);
    });

    it('handles blur events', () => {
      token.simulate('focus', mockEvent);
      expect(isActive(token)).toBe(true);

      token.simulate('blur', mockEvent);
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(isActive(token)).toBe(false);
    });

    it('handles keydown events', () => {
      const preventDefault = jest.fn();

      token.simulate('keyDown', {
        keyCode: BACKSPACE,
        preventDefault,
      });

      // `onRemove` called only when token is active.
      expect(onRemove).toHaveBeenCalledTimes(0);
      expect(preventDefault).toHaveBeenCalledTimes(0);

      token.simulate('focus', mockEvent);
      token.simulate('keyDown', {
        keyCode: BACKSPACE,
        preventDefault,
      });
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(preventDefault).toHaveBeenCalledTimes(1);

      // Other events are ignored.
      token.simulate('keyDown', {
        keyCode: RETURN,
        preventDefault,
      });
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
