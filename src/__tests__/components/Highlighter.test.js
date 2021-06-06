import { shallow } from 'enzyme';
import React from 'react';

import Highlighter from '../../components/Highlighter';

function getMatches(wrapper) {
  return wrapper.find('mark');
}

describe('<Highlighter>', () => {
  let highlighter;

  beforeEach(() => {
    highlighter = shallow(<Highlighter search="">California</Highlighter>);
  });

  it('does not highlight text when there is no search string', () => {
    expect(highlighter.text()).toBe('California');
    expect(getMatches(highlighter)).toHaveLength(0);
  });

  it('does not highlight text when there is no match', () => {
    highlighter.setProps({ search: 'x' });
    expect(getMatches(highlighter)).toHaveLength(0);
  });

  it('handles an empty child string', () => {
    highlighter.setProps({
      children: '',
      search: 'foo',
    });

    expect(highlighter.text()).toBe('');
  });

  it('highlights text in the middle of a string', () => {
    highlighter.setProps({ search: 'i' });

    // Output: [Cal, <mark>i</mark>, forn, <mark>i</mark>, a]
    expect(highlighter.length).toBe(5);
    expect(highlighter.first().text()).toBe('Cal');

    const matches = getMatches(highlighter);
    expect(matches.length).toBe(2);
    expect(matches.first().text()).toBe('i');
    expect(matches.first().hasClass('rbt-highlight-text')).toBe(true);
  });

  it('highlights text at the beginning of a string', () => {
    highlighter.setProps({ search: 'cal' });

    // Output: [<mark>Cal</mark>, ifornia]
    expect(highlighter.length).toBe(2);
    expect(highlighter.first().text()).toBe('Cal');

    const matches = getMatches(highlighter);
    expect(matches.length).toBe(1);
    expect(matches.first().text()).toBe('Cal');
  });

  it('adds custom classnames to the highlighted children', () => {
    highlighter.setProps({
      highlightClassName: 'foo',
      search: 'i',
    });

    expect(getMatches(highlighter).first().hasClass('foo')).toBe(true);
  });
});
