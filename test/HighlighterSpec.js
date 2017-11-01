import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';

import Highlighter from '../src/Highlighter';

function getHighlighterInstance(children, search) {
  return TestUtils.renderIntoDocument(
    <Highlighter search={search}>
      {children}
    </Highlighter>
  );
}

function getMatches(children, search) {
  return TestUtils.scryRenderedDOMComponentsWithTag(
    getHighlighterInstance(children, search),
    'mark'
  );
}

describe('<Highlighter>', () => {

  it('renders a span containing a string', () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <Highlighter search="">
        California
      </Highlighter>
    );
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('span');
    expect(result.props.children).to.equal('California');
  });

  it('correctly highlights text', () => {
    const matches = getMatches('California', 'a');

    expect(matches.length).to.equal(2);
    expect(matches[0].innerHTML).to.equal('a');
  });

  it('does not highlight text when there is no match', () => {
    const matches = getMatches('California', 'x');
    expect(matches.length).to.equal(0);
  });

  it('is case-insensitive', () => {
    const matches = getMatches('California', 'cal');

    expect(matches.length).to.equal(1);
    expect(matches[0].innerHTML).to.equal('Cal');
  });

  it('ignores diacritical marks', () => {
    const matches = getMatches('Kraków', 'krako');

    expect(matches.length).to.equal(1);
    expect(matches[0].innerHTML).to.equal('Krakó');
  });

});
