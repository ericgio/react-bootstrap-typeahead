import * as React from 'react';

import * as stories from './Hint.stories';
import {
  composeStories,
  generateSnapshots,
  render,
  screen,
} from '../../tests/helpers';

const { Default } = composeStories(stories);

describe('<Hint>', () => {
  generateSnapshots(stories);

  it('applies a classname and style to the containing element', () => {
    const { container } = render(
      <Default className="custom-class" style={{ backgroundColor: 'blue' }} />
    );

    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('applies a classname and style to the hint element', () => {
    render(<Default hintClassName="hint-class" hintStyle={{ color: 'red' }} />);

    const hintElement = screen.getByDisplayValue('california');
    expect(hintElement).toHaveClass('hint-class');
    expect(hintElement).toHaveStyle({ color: 'red' });
  });
});
