import {expect} from 'chai';
import {AsyncTypeahead, Highlighter, Menu, MenuItem, Token, Typeahead, TypeaheadMenu, asyncContainer, menuItemContainer, tokenContainer} from '../../src';
import _AsyncTypeahead from '../../src/AsyncTypeahead.react';
import _Highlighter from '../../src/Highlighter.react';
import _Menu from '../../src/Menu.react';
import _MenuItem from '../../src/MenuItem.react';
import _Token from '../../src/Token.react';
import _Typeahead from '../../src/Typeahead.react';
import _TypeaheadMenu from '../../src/TypeaheadMenu.react';
import _asyncContainer from '../../src/containers/asyncContainer';
import _menuItemContainer from '../../src/containers/menuItemContainer';
import _tokenContainer from '../../src/containers/tokenContainer';

describe('<HintedInput>', () => {
  it('AsyncTypeahead is exported', () => {
    expect(AsyncTypeahead).to.equal(_AsyncTypeahead);
  });

  it('Highlighter is exported', () => {
    expect(Highlighter).to.equal(_Highlighter);
  });

  it('Menu is exported', () => {
    expect(Menu).to.equal(_Menu);
  });

  it('MenuItem is exported', () => {
    expect(MenuItem).to.equal(_MenuItem);
  });

  it('Token is exported', () => {
    expect(Token).to.equal(_Token);
  });

  it('Typeahead is exported', () => {
    expect(Typeahead).to.equal(_Typeahead);
  });

  it('TypeaheadMenu is exported', () => {
    expect(TypeaheadMenu).to.equal(_TypeaheadMenu);
  });

  it('asyncContainer is exported', () => {
    expect(asyncContainer).to.equal(_asyncContainer);
  });

  it('menuItemContainer is exported', () => {
    expect(menuItemContainer).to.equal(_menuItemContainer);
  });

  it('tokenContainer is exported', () => {
    expect(tokenContainer).to.equal(_tokenContainer);
  });
});
