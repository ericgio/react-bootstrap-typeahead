import { AsyncTypeahead, Highlighter, Menu, MenuItem, Token, Typeahead, TypeaheadMenu, asyncContainer, menuItemContainer, tokenContainer } from '../..';
import _AsyncTypeahead from '../../components/AsyncTypeahead.react';
import _Highlighter from '../../components/Highlighter.react';
import _Menu from '../../components/Menu.react';
import _MenuItem from '../../components/MenuItem.react';
import _Token from '../../components/Token.react';
import _Typeahead from '../../components/Typeahead.react';
import _TypeaheadMenu from '../../components/TypeaheadMenu.react';
import _asyncContainer from '../../containers/asyncContainer';
import _menuItemContainer from '../../containers/menuItemContainer';
import _tokenContainer from '../../containers/tokenContainer';

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
