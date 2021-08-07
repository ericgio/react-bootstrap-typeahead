import React from 'react';

import TypeaheadInputSingle from '../../components/TypeaheadInputSingle';

import options from '../data';
import {
  getHint,
  getInput,
  noop,
  prepareSnapshot,
  render,
  screen,
  TestProvider,
  userEvent,
} from '../helpers';

interface TestComponentProps {
  context?: Record<string, unknown>;
  props?: Record<string, unknown>;
}

const TestComponent = ({ context, props }: TestComponentProps) => {
  return (
    <TestProvider {...context} onKeyDown={noop} options={options} selected={[]}>
      {({ getInputProps }) => (
        <TypeaheadInputSingle
          {...getInputProps()}
          {...props}
          referenceElementRef={noop}
        />
      )}
    </TestProvider>
  );
};

describe('<TypeaheadInputSingle>', () => {
  it('renders a snapshot', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('displays the selected text', () => {
    const text = 'foo';
    render(<TestComponent context={{ text }} />);
    expect(getInput(screen)).toHaveValue(text);
  });

  it('displays a hint and calls `shouldSelectHint`', () => {
    const initialItem = options[0];
    const shouldSelectHint = jest.fn();

    const { container } = render(
      <TestComponent
        context={{
          initialItem,
          isFocused: true,
          isMenuShown: true,
          text: 'Al',
        }}
        props={{
          shouldSelectHint,
        }}
      />
    );

    expect(getHint(container)).toHaveValue(initialItem.name);

    // No need to test the logic for `shouldSelectHint` here; just make sure
    // it's passed through to the `Hint` component and called.
    screen.getByRole('combobox').focus();
    userEvent.tab();
    expect(shouldSelectHint).toHaveBeenCalledTimes(1);
  });
});
