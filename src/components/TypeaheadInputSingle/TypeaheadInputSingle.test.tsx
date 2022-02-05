import React from 'react';

import * as stories from './TypeaheadInputSingle.stories';

import {
  composeStories,
  generateSnapshots,
  getInput,
  render,
  userEvent,
} from '../../tests/helpers';

const { Disabled } = composeStories(stories);

describe('<TypeaheadInputSingle>', () => {
  generateSnapshots(stories);

  it('does not focus a disabled input', () => {
    render(<Disabled />);

    const input = getInput();
    expect(input).toBeDisabled();

    userEvent.click(input);
    expect(input).not.toHaveFocus();
  });
});
