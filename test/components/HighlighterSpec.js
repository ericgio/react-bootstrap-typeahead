import {expect} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';

import Highlighter from '../../src/Highlighter';

describe('<Highlighter>', () => {
  let highlighter, matches;

  beforeEach(() => {
    highlighter = shallow(
      <Highlighter search="">
        California
      </Highlighter>
    );
  });

  it('renders a span containing a string', () => {
    expect(highlighter.type()).to.equal('span');
    expect(highlighter.text()).to.equal('California');
    expect(highlighter.find('mark')).to.have.length(0);
  });

  it('correctly highlights text', () => {
    matches = highlighter
      .setProps({search: 'a'})
      .find('mark');

    expect(matches.length).to.equal(2);
    expect(matches.first().text()).to.equal('a');
  });

  it('does not highlight text when there is no match', () => {
    highlighter.setProps({search: 'x'});
    expect(highlighter.find('mark')).to.have.length(0);
  });

  it('is case-insensitive', () => {
    matches = highlighter
      .setProps({search: 'cal'})
      .find('mark');

    expect(matches.length).to.equal(1);
    expect(matches.first().text()).to.equal('Cal');
  });

  it('ignores diacritical marks', () => {
    const matches = highlighter
      .setProps({
        children: 'Kraków',
        search: 'krako',
      })
      .find('mark');

    expect(matches.length).to.equal(1);
    expect(matches.first().text()).to.equal('Krakó');
  });
    matches = highlighter
      .setProps({search: 'nia cal'})
      .find('mark');

    expect(matches.length).to.equal(0);
  });

    beforeEach(() => {
      highlighter = shallow(
        <Highlighter multiword={true} search="">
          California is warm
        </Highlighter>
      );
    });
      matches = highlighter
        .setProps({search: 'nia cal'})
        .find('mark');

      expect(matches.length).to.equal(2);
      expect(matches.first().text()).to.equal('Cal');
      expect(matches.at(1).text()).to.equal('nia');
    });

    it('combined match', () => {
      matches = highlighter
        .setProps({search: 'is warm'})
        .find('mark');

      expect(matches.length).to.equal(1);
      expect(matches.first().text()).to.equal('is warm');
    });
  });

  describe('beginningOnly', function() {
    beforeEach(() => {
      highlighter = shallow(
        <Highlighter beginningOnly={true} multiword={true} search="">
          California is warm
        </Highlighter>
      );
    });

    it('not matches partly', () => {
      matches = highlighter
        .setProps({search: 'nia cal warm'})
        .find('mark');

      expect(matches.length).to.equal(2);
      expect(matches.first().text()).to.equal('Cal');
      expect(matches.at(1).text()).to.equal('warm');
    });
  });
});
