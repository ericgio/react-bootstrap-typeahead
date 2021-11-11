import React from 'react';

import TypeaheadMenu from '../../components/TypeaheadMenu';

import options from '../data';
import {
  getItems,
  getMenu,
  prepareSnapshot,
  render,
  screen,
  TestProvider,
} from '../helpers';

const TestComponent = (props) => (
  <TestProvider selected={[]}>
    {({ state }) => (
      <TypeaheadMenu
        {...state}
        id="menu-id"
        labelKey="name"
        options={options}
        text=""
        {...props}
      />
    )}
  </TestProvider>
);

describe('<TypeaheadMenu>', () => {
  it('renders a snapshot', () => {
    expect(prepareSnapshot(<TestComponent />)).toMatchSnapshot();
  });

  it('renders a menu with the specified max-height', () => {
    const { rerender } = render(<TestComponent maxHeight="200px" />);
    expect(getMenu().getAttribute('style')).toContain('max-height: 200px;');

    rerender(<TestComponent maxHeight="50%" />);
    expect(getMenu().getAttribute('style')).toContain('max-height: 50%;');
  });

  it('renders an empty state when there are no results', () => {
    const emptyLabel = 'No matches found.';

    render(<TestComponent emptyLabel={emptyLabel} options={[]} />);
    const menuItems = getItems();

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0]).toHaveTextContent(emptyLabel);
  });

  describe('pagination behaviors', () => {
    let paginationProps, paginationText;

    beforeEach(() => {
      paginationText = 'More results...';
      paginationProps = {
        options: options.concat({
          name: '',
          paginationOption: true,
        }),
        paginationText,
      };
    });

    it('displays a paginator', () => {
      render(<TestComponent {...paginationProps} />);
      expect(screen.queryByText(paginationText)).toBeInTheDocument();
    });

    it('does not show a paginator when there are no results', () => {
      render(<TestComponent {...paginationProps} options={[]} />);
      expect(screen.queryByText(paginationText)).not.toBeInTheDocument();
    });
  });
});
