import {expect} from 'chai';
import {
  AsyncTypeahead,
  Highlighter,
  Menu,
  MenuItem,
  Token,
  Typeahead,
  TypeaheadMenu,
  asyncContainer,
  menuItemContainer,
  tokenContainer,
} from '../../src';
import aAsyncTypeahead from '../../src/AsyncTypeahead.react';
import aHighlighter from '../../src/Highlighter.react';
import aMenu from '../../src/Menu.react';
import aMenuItem from '../../src/MenuItem.react';
import aToken from '../../src/Token.react';
import aTypeahead from '../../src/Typeahead.react';
import aTypeaheadMenu from '../../src/TypeaheadMenu.react';
import aasyncContainer from '../../src/containers/asyncContainer';
import amenuItemContainer from '../../src/containers/menuItemContainer';
import atokenContainer from '../../src/containers/tokenContainer';

describe('<HintedInput>', () => {
  it('AsyncTypeahead is exported', () => {
    expect(AsyncTypeahead).to.equal(aAsyncTypeahead);
  });

  it('Highlighter is exported', () => {
    expect(Highlighter).to.equal(aHighlighter);
  });

  it('Menu is exported', () => {
    expect(Menu).to.equal(aMenu);
  });

  it('MenuItem is exported', () => {
    expect(MenuItem).to.equal(aMenuItem);
  });

  it('Token is exported', () => {
    expect(Token).to.equal(aToken);
  });

  it('Typeahead is exported', () => {
    expect(Typeahead).to.equal(aTypeahead);
  });

  it('TypeaheadMenu is exported', () => {
    expect(TypeaheadMenu).to.equal(aTypeaheadMenu);
  });

  it('asyncContainer is exported', () => {
    expect(asyncContainer).to.equal(aasyncContainer);
  });

  it('menuItemContainer is exported', () => {
    expect(menuItemContainer).to.equal(amenuItemContainer);
  });

  it('tokenContainer is exported', () => {
    expect(tokenContainer).to.equal(atokenContainer);
  });
});
