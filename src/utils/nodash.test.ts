import {isFunction, isString, noop, once, pick, uniqueId} from './nodash';

const arr: string[] = [];
const fn = noop;
const obj = {};
const str = 'foo';

describe('nodash', () => {
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
    // @ts-expect-error
    expect(pick(object, ['baz'])).toEqual({});
  });

  test('uniqueId', () => {
    expect(uniqueId()).toBe('1');
    expect(uniqueId('foo-')).toBe('foo-2');
  });

  test('once', () =>{
    const myFunc = jest.fn((a: number) => a);

    const onlyOnce = once(myFunc)

    let result = -100;
    for (let i = 0; i < 100; i++) {
      result = onlyOnce(i)
    }

    expect(myFunc).toBeCalledTimes(1)
    expect(result).toBe(0)
  })
});
