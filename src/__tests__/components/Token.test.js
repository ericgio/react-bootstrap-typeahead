import { mount } from 'enzyme';
import React from 'react';

import Token from '../../components/Token.react';
import { BACKSPACE, RETURN } from '../../constants';

const option = {
  label: 'test option',
};

function getCloseButton(wrapper) {
  return wrapper.find('.rbt-token-remove-button').hostNodes();
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
    token = mount(
      <Token option={option}>
        This is a token
      </Token>
    );
  });

  test('renders a basic token', () => {
    expect(token.find('div').hasClass('rbt-token')).toBe(true);
    expect(token.text()).toBe('This is a token');
  });

  describe('renders a non-removeable token', () => {
    afterEach(() => {
      expect(isRemoveable(token)).toBe(false);
    });

    test('when no `onRemove` function is passed in', () => {
      token.setProps({ onRemove: undefined });
    });

    test('when the token is disabled', () => {
      token.setProps({ disabled: true });
      expect(isDisabled(token)).toBe(true);
    });

    test('when the token is read-only', () => {
      token.setProps({ readOnly: true });
    });
  });

  test('renders a removeable token', () => {
    const onRemove = jest.fn();

    token.setProps({ onRemove });

    expect(isRemoveable(token)).toBe(true);

    const closeButton = getCloseButton(token);
    closeButton.simulate('click');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('renders a token with an href', () => {
    const href = '#someHref';
    token.setProps({ href });

    const anchor = token.find('a');
    expect(anchor).toHaveLength(1);
    expect(anchor.hasClass('rbt-token')).toBe(true);
    expect(anchor.prop('href')).toBe(href);
  });

  test('disabled tokens are not interactive', () => {
    token.setProps({
      disabled: true,
      href: '#somehref',
    });

    expect(token.find('div')).toHaveLength(1);
    expect(token.find('a')).toHaveLength(0);
    expect(isDisabled(token)).toBe(true);
  });

  describe('event handlers', () => {
    let mockEvent, stopPropagation;

    beforeEach(() => {
      stopPropagation = jest.fn();
      mockEvent = { stopPropagation };

      // Must set `onRemove` to make it a removeable token.
      token.setProps({ onRemove: () => {} });
      expect(token.state('active')).toBe(false);
    });

    afterEach(() => {
      token.setState({ active: false });
    });

    test('handles click events', () => {
      const onClick = jest.fn();

      token.setProps({ onClick });
      token.simulate('click', mockEvent);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(stopPropagation).toHaveBeenCalledTimes(1);
      expect(token.state('active')).toBe(true);
    });

    test('handles focus events', () => {
      const onFocus = jest.fn();

      token.setProps({ onFocus });
      token.simulate('focus', mockEvent);

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(stopPropagation).toHaveBeenCalledTimes(1);
      expect(token.state('active')).toBe(true);
    });

    test('handles blur events', () => {
      const onBlur = jest.fn();

      token.setProps({ onBlur });
      token.setState({ active: true });
      token.simulate('blur');

      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(token.state('active')).toBe(false);
    });

    test('handles keydown events', () => {
      const onRemove = jest.fn();
      const preventDefault = jest.fn();

      token.setProps({ onRemove });
      token.simulate('keyDown', {
        keyCode: BACKSPACE,
        preventDefault,
      });

      // `onRemove` called only when token is active.
      expect(onRemove).toHaveBeenCalledTimes(0);
      expect(preventDefault).toHaveBeenCalledTimes(0);

      token.setState({ active: true });
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
