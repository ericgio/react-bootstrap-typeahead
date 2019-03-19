import { shallow } from 'enzyme';
import React from 'react';

import Highlighter from '../../components/Highlighter.react';

describe('<Highlighter>', () => {
  let highlighter;

  beforeEach(() => {
    highlighter = shallow(
      <Highlighter search="">
        California
      </Highlighter>
    );
  });

  test('does not highlight text when there is no search string', () => {
    expect(highlighter.text()).toBe('California');
    expect(highlighter.find('mark')).toHaveLength(0);
  });

  test('does not highlight text when there is no match', () => {
    highlighter.setProps({ search: 'x' });
    expect(highlighter.find('mark')).toHaveLength(0);
  });

  test('handles an empty child string', () => {
    highlighter.setProps({
      children: '',
      search: 'foo',
    });

    expect(highlighter.text()).toBe('');
  });

  test('correctly highlights text', () => {
    highlighter.setProps({ search: 'i' });

    // Output: [Cal, <mark>i</mark>, forn, <mark>i</mark>, a]
    expect(highlighter.length).toBe(5);
    expect(highlighter.first().text()).toBe('Cal');

    const matches = highlighter.find('mark');
    expect(matches.length).toBe(2);
    expect(matches.first().text()).toBe('i');
    expect(matches.first().hasClass('rbt-highlight-text')).toBe(true);
  });

  test('adds custom classnames to the highlighted children', () => {
    highlighter.setProps({
      highlightClassName: 'foo',
      search: 'i',
    });

    expect(highlighter.find('mark').first().hasClass('foo')).toBe(true);
  });
});
