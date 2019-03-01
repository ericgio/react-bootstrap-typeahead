import { mount } from 'enzyme';
import { head, noop } from 'lodash';
import React from 'react';

import TypeaheadInputMulti from '../../src/components/TypeaheadInputMulti.react';

import options from '../../example/exampleData';
import { context, getFormControl, getHint, getInput, getTokens, TestInputProvider } from '../helpers';

describe('<TypeaheadInputMulti>', () => {
  let text, wrapper;

  beforeEach(() => {
    text = 'text';
    wrapper = mount(
      <TestInputProvider
        {...context}
        inputProps={{}}
        labelKey="name"
        multiple
        options={options}
        selected={options.slice(1, 4)}
        selectHintOnEnter={false}
        text={text}>
        {(props) => (
          <TypeaheadInputMulti
            {...props}
            inputRef={noop}
            onAdd={noop}
            onChange={noop}
            onFocus={noop}
            onKeyDown={noop}
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
});
