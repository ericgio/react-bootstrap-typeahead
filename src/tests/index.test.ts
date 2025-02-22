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
  TypeaheadContext,
  TypeaheadInputMulti,
  TypeaheadInputSingle,
  TypeaheadMenu,
  useAsync,
  useHint,
  useItem,
  useOverlay,
  useToken,
  useTypeahead,
} from '..';

import _AsyncTypeahead from '../components/AsyncTypeahead';
import _ClearButton from '../components/ClearButton';
import _Highlighter from '../components/Highlighter';
import _Hint from '../components/Hint';
import _Input from '../components/Input';
import _Loader from '../components/Loader';
import _Menu from '../components/Menu';
import _MenuItem from '../components/MenuItem';
import _Token from '../components/Token';
import _Typeahead from '../components/Typeahead';
import _TypeaheadInputMulti from '../components/TypeaheadInputMulti';
import _TypeaheadInputSingle from '../components/TypeaheadInputSingle';
import _TypeaheadMenu from '../components/TypeaheadMenu';

import {
  useAsync as _useAsync,
  useHint as _useHint,
  useItem as _useItem,
  useOverlay as _useOverlay,
  useToken as _useToken,
} from '../hooks';

import {
  TypeaheadContext as _TypeaheadContext,
  useTypeahead as _useTypeahead,
} from '../core';

describe('index.ts exports', () => {
  it('exports the components', () => {
    expect(AsyncTypeahead).toBe(_AsyncTypeahead);
    expect(ClearButton).toBe(_ClearButton);
    expect(Highlighter).toBe(_Highlighter);
    expect(Hint).toBe(_Hint);
    expect(Input).toBe(_Input);
    expect(Loader).toBe(_Loader);
    expect(Menu).toBe(_Menu);
    expect(MenuItem).toBe(_MenuItem);
    expect(Token).toBe(_Token);
    expect(Typeahead).toBe(_Typeahead);
    expect(TypeaheadInputMulti).toBe(_TypeaheadInputMulti);
    expect(TypeaheadInputSingle).toBe(_TypeaheadInputSingle);
    expect(TypeaheadMenu).toBe(_TypeaheadMenu);
  });

  it('exports the hooks', () => {
    expect(useAsync).toBe(_useAsync);
    expect(useHint).toBe(_useHint);
    expect(useItem).toBe(_useItem);
    expect(useOverlay).toBe(_useOverlay);
    expect(useToken).toBe(_useToken);
  });

  it('exports core hooks and context', () => {
    expect(TypeaheadContext).toBe(_TypeaheadContext);
    expect(useTypeahead).toBe(_useTypeahead);
  });
});
