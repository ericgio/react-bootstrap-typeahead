import addCustomOption from '../../utils/addCustomOption';
import options from '../data';

describe('addCustomOption', () => {
  let defaultProps, labelKey;

  beforeEach(() => {
    labelKey = 'name';
    defaultProps = {
      allowNew: true,
      labelKey,
      text: 'zzz',
    };
  });

  test('does not add a custom option when `allowNew` is false', () => {
    const props = {
      ...defaultProps,
      allowNew: false,
    };
    expect(addCustomOption(options, props)).toBe(false);
  });

  test('does not add a custom option when no text is entered', () => {
    const props = {
      ...defaultProps,
      text: '',
    };
    expect(addCustomOption(options, props)).toBe(false);
  });

  test('adds a custom option if no matches are found', () => {
    expect(addCustomOption(options, defaultProps)).toBe(true);
  });

  test('adds a custom option when `labelKey` is a function', () => {
    const props = {
      ...defaultProps,
      labelKey: (o) => o.name,
    };
    expect(addCustomOption(options, props)).toBe(true);
  });

  test('adds a custom option when no exact matches are found', () => {
    const props = { ...defaultProps, text: 'Ala' };
    expect(addCustomOption(options, props)).toBe(true);
  });

  test('does not add a custom option when an exact match is found', () => {
    const props = { ...defaultProps, text: 'Wyoming' };
    expect(addCustomOption(options, props)).toBe(false);
  });

  test('adds a custom option when `allowNew` returns true', () => {
    const props = {
      ...defaultProps,
      allowNew: () => true,
      text: 'North Carolina', // Would otherwise return false
    };
    expect(addCustomOption(options, props)).toBe(true);
  });

  test('does not add a custom option when `allowNew` returns false', () => {
    const props = {
      ...defaultProps,
      allowNew: () => false,
      text: 'xxx', // Would otherwise return true
    };
    expect(addCustomOption(options, props)).toBe(false);
  });
});
