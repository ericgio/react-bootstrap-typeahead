import {
  AsyncTypeahead,
  ClearButton,
  Highlighter,
  Hint,
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
  menuItemContainer,
  tokenContainer,
  useAsync,
  useHint,
  useItem,
  useToken,
} from '../..';

import _AsyncTypeahead from '../../components/AsyncTypeahead';
import _ClearButton from '../../components/ClearButton';
import _Highlighter from '../../components/Highlighter';
import _Hint, { useHint as _useHint } from '../../components/Hint';
import _Input from '../../components/Input';
import _Loader from '../../components/Loader';
import _Menu from '../../components/Menu';
import _MenuItem from '../../components/MenuItem';
import _Token from '../../components/Token';
import _Typeahead from '../../components/Typeahead';
import _TypeaheadInputMulti from '../../components/TypeaheadInputMulti';
import _TypeaheadInputSingle from '../../components/TypeaheadInputSingle';
import _TypeaheadMenu from '../../components/TypeaheadMenu';

import _asyncContainer, { useAsync as _useAsync } from '../../containers/asyncContainer';
import _menuItemContainer, { useItem as _useItem } from '../../containers/menuItemContainer';
import _tokenContainer, { useToken as _useToken } from '../../containers/tokenContainer';

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

  test('Hint is exported', () => {
    expect(Hint).toBe(_Hint);
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

  test('menuItemContainer is exported', () => {
    expect(menuItemContainer).toBe(_menuItemContainer);
  });

  test('tokenContainer is exported', () => {
    expect(tokenContainer).toBe(_tokenContainer);
  });

  test('useAsync is exported', () => {
    expect(useAsync).toBe(_useAsync);
  });

  test('useHint is exported', () => {
    expect(useHint).toBe(_useHint);
  });

  test('useItem is exported', () => {
    expect(useItem).toBe(_useItem);
  });

  test('useToken is exported', () => {
    expect(useToken).toBe(_useToken);
  });
});
