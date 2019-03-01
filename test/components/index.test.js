import { AsyncTypeahead, Highlighter, Menu, MenuItem, Token, Typeahead, TypeaheadMenu, asyncContainer, menuItemContainer, tokenContainer } from '../../src';
import _AsyncTypeahead from '../../src/components/AsyncTypeahead.react';
import _Highlighter from '../../src/components/Highlighter.react';
import _Menu from '../../src/components/Menu.react';
import _MenuItem from '../../src/components/MenuItem.react';
import _Token from '../../src/components/Token.react';
import _Typeahead from '../../src/components/Typeahead.react';
import _TypeaheadMenu from '../../src/components/TypeaheadMenu.react';
import _asyncContainer from '../../src/containers/asyncContainer';
import _menuItemContainer from '../../src/containers/menuItemContainer';
import _tokenContainer from '../../src/containers/tokenContainer';

describe('<HintedInput>', () => {
  test('AsyncTypeahead is exported', () => {
    expect(AsyncTypeahead).toBe(_AsyncTypeahead);
  });

  test('Highlighter is exported', () => {
    expect(Highlighter).toBe(_Highlighter);
  });

  test('Menu is exported', () => {
    expect(Menu).toBe(_Menu);
  });

  test('MenuItem is exported', () => {
    expect(MenuItem).toBe(_MenuItem);
  });

  test('Token is exported', () => {
    expect(Token).toBe(_Token);
  });

  test('Typeahead is exported', () => {
    expect(Typeahead).toBe(_Typeahead);
  });

  test('TypeaheadMenu is exported', () => {
    expect(TypeaheadMenu).toBe(_TypeaheadMenu);
  });

  test('asyncContainer is exported', () => {
    expect(asyncContainer).toBe(_asyncContainer);
  });

  test('menuItemContainer is exported', () => {
    expect(menuItemContainer).toBe(_menuItemContainer);
  });

  test('tokenContainer is exported', () => {
    expect(tokenContainer).toBe(_tokenContainer);
  });
});
