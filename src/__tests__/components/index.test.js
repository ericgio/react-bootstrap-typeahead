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
  withAsync,
  withItem,
  withToken,
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

import _asyncContainer, {
  useAsync as _useAsync,
  withAsync as _withAsync,
} from '../../behaviors/async';
import _menuItemContainer, {
  useItem as _useItem,
  withItem as _withItem,
} from '../../behaviors/item';
import _tokenContainer, {
  useToken as _useToken,
  withToken as _withToken,
} from '../../behaviors/token';

describe('index.js', () => {
  it('AsyncTypeahead is exported', () => {
    expect(AsyncTypeahead).toBe(_AsyncTypeahead);
  });

  it('ClearButton is exported', () => {
    expect(ClearButton).toBe(_ClearButton);
  });

  it('Highlighter is exported', () => {
    expect(Highlighter).toBe(_Highlighter);
  });

  it('Hint is exported', () => {
    expect(Hint).toBe(_Hint);
    expect(useHint).toBe(_useHint);
  });

  it('Input is exported', () => {
    expect(Input).toBe(_Input);
  });

  it('Loader is exported', () => {
    expect(Loader).toBe(_Loader);
  });

  it('Menu is exported', () => {
    expect(Menu).toBe(_Menu);
  });

  it('MenuItem is exported', () => {
    expect(MenuItem).toBe(_MenuItem);
  });

  it('Token is exported', () => {
    expect(Token).toBe(_Token);
  });

  it('Typeahead is exported', () => {
    expect(Typeahead).toBe(_Typeahead);
  });

  it('TypeaheadInputMulti is exported', () => {
    expect(TypeaheadInputMulti).toBe(_TypeaheadInputMulti);
  });

  it('TypeaheadInputSingle is exported', () => {
    expect(TypeaheadInputSingle).toBe(_TypeaheadInputSingle);
  });

  it('TypeaheadMenu is exported', () => {
    expect(TypeaheadMenu).toBe(_TypeaheadMenu);
  });

  it('async exports', () => {
    expect(asyncContainer).toBe(_asyncContainer);
    expect(useAsync).toBe(_useAsync);
    expect(withAsync).toBe(_withAsync);
  });

  it('item exports', () => {
    expect(menuItemContainer).toBe(_menuItemContainer);
    expect(useItem).toBe(_useItem);
    expect(withItem).toBe(_withItem);
  });

  it('token exports', () => {
    expect(tokenContainer).toBe(_tokenContainer);
    expect(useToken).toBe(_useToken);
    expect(withToken).toBe(_withToken);
  });
});
