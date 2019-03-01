import getOptionProperty from '../../src/utils/getOptionProperty';

describe('getOptionProperty', () => {
  test('retrieves the property from the option', () => {
    expect(getOptionProperty({ foo: 'bar' }, 'foo')).toBe('bar');
    expect(getOptionProperty('foo')).toBeUndefined();
  });
});
