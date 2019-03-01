import { mount } from 'enzyme';
import { head, noop } from 'lodash';
import React from 'react';

import TypeaheadInputSingle from '../../src/components/TypeaheadInputSingle.react';

import options from '../../example/exampleData';
import { context, getFormControl, getHint, getInput, TestInputProvider } from '../helpers';

describe('<TypeaheadInputSingle>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TestInputProvider
        {...context}
        inputProps={{}}
        labelKey="name"
        options={options}
        selected={[]}
        selectHintOnEnter={false}
        text="">
        {(props) => (
          <TypeaheadInputSingle
            {...props}
            inputRef={noop}
            onAdd={noop}
            onChange={noop}
            onClear={noop}
            onFocus={noop}
          />
        )}
      </TestInputProvider>
    );
  });

  test('renders a single-select input', () => {
    const input = getFormControl(wrapper);

    expect(input.length).toBe(1);
    expect(input.hasClass('rbt-input')).toBe(true);
    expect(input.hasClass('rbt-input-main')).toBe(true);
  });

  test('displays the selected text', () => {
    const text = 'text';

    wrapper.setProps({ text });

    expect(getInput(wrapper).prop('value')).toBe(text);
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
