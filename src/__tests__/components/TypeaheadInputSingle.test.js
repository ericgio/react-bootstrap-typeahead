import { mount } from 'enzyme';
import { head } from 'lodash';
import React from 'react';

import TypeaheadInputSingle from '../../components/TypeaheadInputSingle.react';

import options from '../data';
import { getFormControl, getHint, getInput, TestProvider } from '../helpers';

describe('<TypeaheadInputSingle>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TestProvider
        options={options}
        selected={[]}>
        {({ getInputProps }) => (
          <TypeaheadInputSingle {...getInputProps()} />
        )}
      </TestProvider>
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
