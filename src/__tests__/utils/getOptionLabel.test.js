import getOptionLabel from '../../utils/getOptionLabel';

describe('getOptionLabel', () => {
  let label, option;

  beforeEach(() => {
    label = 'California';
    option = { label };
  });

  describe('returns a string when', () => {
    test('receives an `option` string', () => {
      const optionLabel = getOptionLabel(label);
      expect(optionLabel).toBe(label);
    });

    test('receives a `labelKey` function', () => {
      const labelKeyFunction = (o) => o.label;
      const optionLabel = getOptionLabel(option, labelKeyFunction);
      expect(optionLabel).toBe(label);
    });

    test('receives a `labelKey` string', () => {
      const optionLabel = getOptionLabel(option, 'label');
      expect(optionLabel).toBe(label);
    });
  });

  test('gives precedence to `labelKey` when it is a function', () => {
    const customLabel = 'Custom Label';
    const optionLabel = getOptionLabel(label, () => customLabel);
    expect(optionLabel).toBe(customLabel);
  });

  describe('throws an error when', () => {
    test('has an invalid option', () => {
      const willThrow = () => getOptionLabel([], 'label');
      expect(willThrow).toThrowError(Error);
    });

    test('has no labelKey and the option is an object', () => {
      const willThrow = () => getOptionLabel(option);
      expect(willThrow).toThrowError(Error);
    });
  });
});
