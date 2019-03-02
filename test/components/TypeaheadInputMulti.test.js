import { mount } from 'enzyme';
import { head, noop } from 'lodash';
import React from 'react';

import TypeaheadInputMulti from '../../src/components/TypeaheadInputMulti.react';

import options from '../../example/exampleData';
import { context, focus, getFormControl, getHint, getInput, getTokens, keyDown, TestInputProvider } from '../helpers';
import { BACKSPACE, RETURN } from '../../src/constants';

function isFocused(element) {
  return element.getDOMNode() === document.activeElement;
}

describe('<TypeaheadInputMulti>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TestInputProvider
        {...context}
        inputProps={{}}
        labelKey="name"
        multiple
        onFocus={noop}
        onKeyDown={noop}
        options={options}
        selected={options.slice(1, 4)}
        selectHintOnEnter={false}
        text="">
        {(props) => (
          <TypeaheadInputMulti
            {...props}
            inputRef={noop}
            onAdd={noop}
            onChange={noop}
          />
        )}
      </TestInputProvider>
    );
  });

  test('renders a multi-select input', () => {
    const input = getFormControl(wrapper);

    expect(input.length).toBe(1);
    expect(input.hasClass('rbt-input')).toBe(true);
    expect(input.hasClass('rbt-input-multi')).toBe(true);
  });

  test('displays the selected text', () => {
    const text = 'foo';
    wrapper.setProps({ text });
    expect(getInput(wrapper).prop('value')).toBe(text);
  });

  test('renders a multi-select input with tokens', () => {
    expect(getTokens(wrapper).length).toBe(3);
  });

  test('displays a hint', () => {
    const initialItem = head(options);

    wrapper.setProps({
      initialItem,
      isFocused: true,
      isMenuShown: true,
      text: 'Al',
    });

    expect(getHint(wrapper)).toBe(initialItem.name);
  });

  test('does not focus a disabled input', () => {
    expect(isFocused(getInput(wrapper))).toBe(false);

    wrapper.setProps({ disabled: true });
    wrapper.simulate('click');

    expect(isFocused(getInput(wrapper))).toBe(false);

    wrapper.setProps({ disabled: false });
    wrapper.simulate('click');

    expect(isFocused(getInput(wrapper))).toBe(true);
  });

  describe('keydown handler', () => {
    let onKeyDown;

    beforeEach(() => {
      onKeyDown = jest.fn();
      wrapper.setProps({
        onKeyDown,
      });
    });

    test('calls the keydown handler', () => {
      keyDown(wrapper, RETURN);
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    test('focuses the last token', () => {
      const input = getInput(wrapper);

      focus(wrapper);
      expect(input.getDOMNode()).toEqual(document.activeElement);

      keyDown(wrapper, BACKSPACE);

      expect(isFocused(getTokens(wrapper).last())).toBe(true);
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    test('does not focus the last token when the input has a value', () => {
      wrapper.setProps({
        text: 'foo',
      });

      focus(wrapper);
      keyDown(wrapper, BACKSPACE);

      expect(isFocused(getInput(wrapper))).toBe(true);
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});
