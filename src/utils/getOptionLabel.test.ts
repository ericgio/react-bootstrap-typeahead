import getOptionLabel from './getOptionLabel';
import getStringLabelKey from './getStringLabelKey';

import { Option } from '../types';

const name = 'California';
const option = { name };
// @ts-expect-error
const labelKeyFn = (o: Option) => o.name;

describe('getOptionLabel', () => {
  it('returns a string when it receives a string `option` value', () => {
    const optionLabel = getOptionLabel(name, '');
    expect(optionLabel).toBe(name);
  });

  it('returns a string when it receives a `labelKey` function', () => {
    const optionLabel = getOptionLabel(option, labelKeyFn);
    expect(optionLabel).toBe(name);
  });

  it('returns a string when it receives a `labelKey` string', () => {
    const optionLabel = getOptionLabel(option, 'name');
    expect(optionLabel).toBe(name);
  });

  it('handles custom and pagination options', () => {
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

  it('gives precedence to `labelKey` when it is a function', () => {
    const customLabel = 'Custom Label';
    const optionLabel = getOptionLabel(name, () => customLabel);
    expect(optionLabel).toBe(customLabel);
  });

  it('throws an error when an invalid option is encountered', () => {
    const willThrow = () => getOptionLabel([], 'name');
    expect(willThrow).toThrowError(Error);
  });

  it('throws an error when `option` is an object and no labelkey is specified', () => {
    // @ts-expect-error
    const willThrow = () => getOptionLabel(option);
    expect(willThrow).toThrowError(Error);
  });
});
