import { shallow } from 'enzyme';
import React from 'react';

import Highlighter from '../../src/components/Highlighter.react';

describe('<Highlighter>', () => {
  let highlighter, matches;

  beforeEach(() => {
    highlighter = shallow(
      <Highlighter search="">
        California
      </Highlighter>
    );
  });

  test('renders a span containing a string', () => {
    expect(highlighter.type()).toBe('span');
    expect(highlighter.text()).toBe('California');
    expect(highlighter.find('mark')).toHaveLength(0);
  });

  test('correctly highlights text', () => {
    matches = highlighter
      .setProps({ search: 'a' })
      .find('mark');

    expect(matches.length).toBe(2);
    expect(matches.first().text()).toBe('a');
  });

  test('does not highlight text when there is no match', () => {
    highlighter.setProps({ search: 'x' });
    expect(highlighter.find('mark')).toHaveLength(0);
  });

  test('is case-insensitive', () => {
    matches = highlighter
      .setProps({ search: 'cal' })
      .find('mark');

    expect(matches.length).toBe(1);
    expect(matches.first().text()).toBe('Cal');
  });

  test('ignores diacritical marks', () => {
    matches = highlighter
      .setProps({
        children: 'Kraków',
        search: 'krako',
      })
      .find('mark');

    expect(matches.length).toBe(1);
    expect(matches.first().text()).toBe('Krakó');
  });
});
