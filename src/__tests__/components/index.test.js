import {
  AsyncTypeahead,
  ClearButton,
  Highlighter,
  Input,
  Loader,
  Menu,
  MenuItem,
  Token,
  Typeahead,
  TypeaheadInputMulti,
  TypeaheadInputSingle,
  TypeaheadMenu,
  asyncContainer,
  hintContainer,
  menuItemContainer,
  tokenContainer,
} from '../..';

import _AsyncTypeahead from '../../components/AsyncTypeahead.react';
import _ClearButton from '../../components/ClearButton.react';
import _Highlighter from '../../components/Highlighter.react';
import _Input from '../../components/Input.react';
import _Loader from '../../components/Loader.react';
import _Menu from '../../components/Menu.react';
import _MenuItem from '../../components/MenuItem.react';
import _Token from '../../components/Token.react';
import _Typeahead from '../../components/Typeahead.react';
import _TypeaheadInputMulti from '../../components/TypeaheadInputMulti.react';
import _TypeaheadInputSingle from '../../components/TypeaheadInputSingle.react';
import _TypeaheadMenu from '../../components/TypeaheadMenu.react';

import _asyncContainer from '../../containers/asyncContainer';
import _hintContainer from '../../containers/hintContainer';
import _menuItemContainer from '../../containers/menuItemContainer';
import _tokenContainer from '../../containers/tokenContainer';

describe('index.js', () => {
  test('AsyncTypeahead is exported', () => {
    expect(AsyncTypeahead).toBe(_AsyncTypeahead);
  });

  test('ClearButton is exported', () => {
    expect(ClearButton).toBe(_ClearButton);
  });

  test('Highlighter is exported', () => {
    expect(Highlighter).toBe(_Highlighter);
  });

  test('Input is exported', () => {
    expect(Input).toBe(_Input);
  });

  test('Loader is exported', () => {
    expect(Loader).toBe(_Loader);
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

  test('TypeaheadInputMulti is exported', () => {
    expect(TypeaheadInputMulti).toBe(_TypeaheadInputMulti);
  });

  test('TypeaheadInputSingle is exported', () => {
    expect(TypeaheadInputSingle).toBe(_TypeaheadInputSingle);
  });

  test('TypeaheadMenu is exported', () => {
    expect(TypeaheadMenu).toBe(_TypeaheadMenu);
  });

  test('asyncContainer is exported', () => {
    expect(asyncContainer).toBe(_asyncContainer);
  });

  test('hintContainer is exported', () => {
    expect(hintContainer).toBe(_hintContainer);
  });

  test('menuItemContainer is exported', () => {
    expect(menuItemContainer).toBe(_menuItemContainer);
  });

  test('tokenContainer is exported', () => {
    expect(tokenContainer).toBe(_tokenContainer);
  });
});
