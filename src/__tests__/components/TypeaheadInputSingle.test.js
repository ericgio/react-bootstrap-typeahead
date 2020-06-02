import { mount } from 'enzyme';
import { head, noop } from 'lodash';
import React from 'react';

import TypeaheadInputSingle from '../../components/TypeaheadInputSingle';

import options from '../data';
import { getFormControl, getHint, getInput, keyDown, TestProvider } from '../helpers';
import { TAB } from '../../constants';

describe('<TypeaheadInputSingle>', () => {
  let shouldSelectHint, wrapper;

  beforeEach(() => {
    shouldSelectHint = jest.fn();
    wrapper = mount(
      <TestProvider
        onKeyDown={noop}
        options={options}
        selected={[]}>
        {({ getInputProps }) => (
          <TypeaheadInputSingle
            {...getInputProps()}
            referenceElementRef={noop}
            shouldSelectHint={shouldSelectHint}
          />
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

  test('displays a hint and calls `shouldSelectHint`', () => {
    const initialItem = head(options);

    wrapper.setProps({
      initialItem,
      isFocused: true,
      isMenuShown: true,
      text: 'Al',
    });

    expect(getHint(wrapper)).toBe(initialItem.name);

    // No need to test the logic for `shouldSelectHint` here; just make sure
    // it's passed through to the `Hint` component and called.
    keyDown(wrapper, TAB);
    expect(shouldSelectHint).toHaveBeenCalledTimes(1);
  });
});
