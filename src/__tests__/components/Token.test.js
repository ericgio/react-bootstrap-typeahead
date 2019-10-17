import { mount } from 'enzyme';
import React from 'react';

import Token from '../../components/Token.react';
import { BACKSPACE, RETURN } from '../../constants';

describe('<Token>', () => {
  let token;

  beforeEach(() => {
    token = mount(<Token>This is a token</Token>);
  });

  test('renders a basic token', () => {
    expect(token.find('div').hasClass('rbt-token')).toBe(true);
    expect(token.text()).toBe('This is a token');
  });

  describe('renders a read-only token', () => {
    afterEach(() => {
      expect(token.find('div').hasClass('rbt-token-removeable')).toBe(false);
    });

    test('when the token is disabled', () => {
      token.setProps({ disabled: true });
      expect(token.find('div').hasClass('rbt-token-disabled')).toBe(true);
    });

    test('when the token is read-only', () => {
      token.setProps({
        onRemove: () => {},
        readOnly: true,
      });
    });
  });

  test('renders a removeable token', () => {
    const onRemove = jest.fn();

    token.setProps({ onRemove });

    const rootNode = token.find('.rbt-token');
    expect(rootNode.hasClass('rbt-token-removeable')).toBe(true);

    const closeButton = token.find('button');
    closeButton.simulate('click');

    expect(closeButton.hasClass('rbt-token-remove-button')).toBe(true);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test('renders a token with an href', () => {
    const href = '#someHref';
    token.setProps({ href });

    const anchor = token.find('a');
    expect(anchor).toBeDefined();
    expect(anchor.hasClass('rbt-token')).toBe(true);
    expect(anchor.prop('href')).toBe(href);
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
