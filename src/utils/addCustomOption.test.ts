import addCustomOption from './addCustomOption';
import options, { defaultProps, defaultState } from '../tests/data';

// const labelKey = 'name';

const defaultMerged = {
  ...defaultProps,
  ...defaultState,
  allowNew: true,
  labelKey: 'name',
  text: 'zzz',
};

describe('addCustomOption', () => {
  it('does not add a custom option when `allowNew` is false', () => {
    const props = {
      ...defaultMerged,
      allowNew: false,
    };
    expect(addCustomOption(options, props)).toBe(false);
  });

  it('does not add a custom option when no text is entered', () => {
    const props = {
      ...defaultMerged,
      text: '',
    };
    expect(addCustomOption(options, props)).toBe(false);
  });

  it('adds a custom option if no matches are found', () => {
    expect(addCustomOption(options, defaultMerged)).toBe(true);
  });

  it('adds a custom option when `labelKey` is a function', () => {
    const props = {
      ...defaultMerged,
      labelKey: (o) => o.name,
    };
    expect(addCustomOption(options, props)).toBe(true);
  });

  it('adds a custom option when no exact matches are found', () => {
    const props = { ...defaultMerged, text: 'Ala' };
    expect(addCustomOption(options, props)).toBe(true);
  });

  it('does not add a custom option when an exact match is found', () => {
    const props = { ...defaultMerged, text: 'Wyoming' };
    expect(addCustomOption(options, props)).toBe(false);
  });

  it('adds a custom option when `allowNew` returns true', () => {
    const props = {
      ...defaultMerged,
      allowNew: () => true,
      text: 'North Carolina', // Would otherwise return false
    };
    expect(addCustomOption(options, props)).toBe(true);
  });

  it('does not add a custom option when `allowNew` returns false', () => {
    const props = {
      ...defaultMerged,
      allowNew: () => false,
      text: 'xxx', // Would otherwise return true
    };
    expect(addCustomOption(options, props)).toBe(false);
  });
});
