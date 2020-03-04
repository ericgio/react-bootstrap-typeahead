import {
  head,
  isFunction,
  isString,
  noop,
  pick,
  uniqueId,
  values,
  valuesPolyfill,
} from '../../utils/nodash';

const arr = [];
const fn = noop;
const obj = {};
const str = 'foo';

describe('nodash', () => {
  test('head', () => {
    expect(head([str])).toBe(str);
    [arr, obj, str, fn, null, undefined, NaN].forEach((arg) => {
      expect(head(arg)).toBe(undefined);
    });
  });

  test('isFunction', () => {
    expect(isFunction(fn)).toBe(true);
    [arr, obj, str, null, undefined, NaN].forEach((arg) => {
      expect(isFunction(arg)).toBe(false);
    });
  });

  test('isString', () => {
    expect(isString(str)).toBe(true);
    [arr, obj, fn, null, undefined, NaN].forEach((arg) => {
      expect(isString(arg)).toBe(false);
    });
  });

  test('pick', () => {
    const object = {
      bar: 'one',
      foo: 'two',
    };

    expect(pick(object, ['bar'])).toEqual({ bar: 'one' });
    expect(pick(object, ['baz'])).toEqual({});
  });

  test('uniqueId', () => {
    expect(uniqueId()).toBe('1');
    expect(uniqueId('foo-')).toBe('foo-2');
  });

  test('values', () => {
    const object = {
      bar: null,
      baz: 3,
      foo: 'foo',
    };

    const vals = [null, 3, 'foo'];

    expect(values(object)).toStrictEqual(vals);
    expect(valuesPolyfill(object)).toStrictEqual(vals);
  });
});
