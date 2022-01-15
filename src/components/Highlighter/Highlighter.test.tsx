import React from 'react';

import Highlighter from './Highlighter';
import { render } from '../../tests/helpers';

function getMatches(nodes: NodeListOf<ChildNode>) {
  const arr = Array.from(nodes) as Element[];
  return arr.filter((node) => node.tagName === 'MARK');
}

describe('<Highlighter>', () => {
  it('does not highlight text when there is no search string', () => {
    const { container } = render(
      <Highlighter search="">California</Highlighter>
    );

    const nodes = container.childNodes;
    expect(nodes).toHaveLength(1);
    expect(nodes.item(0)).toHaveTextContent('California');
    expect(getMatches(nodes)).toHaveLength(0);
  });

  it('does not highlight text when there is no match', () => {
    const { container } = render(
      <Highlighter search="x">California</Highlighter>
    );

    expect(getMatches(container.childNodes)).toHaveLength(0);
  });

  it('handles an empty child string', () => {
    // Explicitly set a string as the child.
    // eslint-disable-next-line react/jsx-curly-brace-presence
    const { container } = render(<Highlighter search="foo">{''}</Highlighter>);

    expect(container.childNodes.item(0)).toHaveTextContent('');
  });

  it('highlights text within a string', () => {
    const { container } = render(
      <Highlighter search="i">California</Highlighter>
    );

    const nodes = container.childNodes;
    const matches = getMatches(nodes);

    // Output: [Cal, <mark>i</mark>, forn, <mark>i</mark>, a]
    expect(nodes.length).toBe(5);
    expect(nodes.item(0)).toHaveTextContent('Cal');

    expect(matches.length).toBe(2);
    expect(matches[0]).toHaveTextContent('i');
    expect(matches[0]).toHaveClass('rbt-highlight-text');
  });

  it('highlights text at the beginning of a string', () => {
    const { container } = render(
      <Highlighter search="cal">California</Highlighter>
    );

    const nodes = container.childNodes;
    const matches = getMatches(nodes);

    // Output: [<mark>Cal</mark>, ifornia]
    expect(nodes).toHaveLength(2);
    expect(nodes.item(0)).toHaveTextContent('Cal');

    expect(matches).toHaveLength(1);
    expect(matches[0]).toHaveTextContent('Cal');
  });

  it('adds custom classnames to the highlighted children', () => {
    const { container } = render(
      <Highlighter highlightClassName="foo" search="i">
        California
      </Highlighter>
    );

    expect(getMatches(container.childNodes)[0]).toHaveClass('foo');
  });
});
