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
  useAsync,
  useHint,
  useItem,
  useToken,
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

import _useAsync from '../core/useAsync';
import _useHint from '../core/useHint';
import _useItem from '../core/useItem';
import _useToken from '../core/useToken';

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
    expect(useAsync).toBe(_useAsync);
  });

  it('item exports', () => {
    expect(useItem).toBe(_useItem);
  });

  it('token exports', () => {
    expect(useToken).toBe(_useToken);
  });
});
