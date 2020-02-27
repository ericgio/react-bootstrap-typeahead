import getOptionLabel from '../../utils/getOptionLabel';
import getStringLabelKey from '../../utils/getStringLabelKey';

const labelKeyFn = (o) => o.name;

describe('getOptionLabel', () => {
  let name, option;

  beforeEach(() => {
    name = 'California';
    option = { name };
  });

  describe('returns a string when it receives', () => {
    test('an `option` string', () => {
      const optionLabel = getOptionLabel(name);
      expect(optionLabel).toBe(name);
    });

    test('a `labelKey` function', () => {
      const optionLabel = getOptionLabel(option, labelKeyFn);
      expect(optionLabel).toBe(name);
    });

    test('a `labelKey` string', () => {
      const optionLabel = getOptionLabel(option, 'name');
      expect(optionLabel).toBe(name);
    });
  });

  test('handles custom and pagination options', () => {
    const customOption = {
      [getStringLabelKey(labelKeyFn)]: 'foo',
      customOption: true,
    };

    const paginationOption = {
      [getStringLabelKey(labelKeyFn)]: 'bar',
      paginationOption: true,
    };

    expect(getOptionLabel(customOption, labelKeyFn)).toBe('foo');
    expect(getOptionLabel(paginationOption, labelKeyFn)).toBe('bar');
  });

  test('gives precedence to `labelKey` when it is a function', () => {
    const customLabel = 'Custom Label';
    const optionLabel = getOptionLabel(name, () => customLabel);
    expect(optionLabel).toBe(customLabel);
  });

  describe('throws an error when', () => {
    test('has an invalid option', () => {
      const willThrow = () => getOptionLabel([], 'name');
      expect(willThrow).toThrowError(Error);
    });

    test('has no labelKey and the option is an object', () => {
      const willThrow = () => getOptionLabel(option);
      expect(willThrow).toThrowError(Error);
    });
  });
});
