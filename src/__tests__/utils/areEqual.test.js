import areEqual from '../../utils/areEqual';
import options from '../data';

const labelKey = 'name';

const customOne = {
  customOption: true,
  id: '0',
  [labelKey]: 'foo',
};

const customTwo = {
  customOption: true,
  id: '1',
  [labelKey]: 'foo',
};

const customThree = {
  customOption: true,
  id: '2',
  [labelKey]: 'bar',
};

describe('areEqual', () => {
  test('checks equality of the items', () => {
    expect(areEqual('foo', 'foo', labelKey)).toBe(true);
    expect(areEqual('foo', 'bar', labelKey)).toBe(false);

    expect(areEqual(options[0], options[0], labelKey)).toBe(true);
    expect(areEqual(options[0], options[1], labelKey)).toBe(false);

    expect(areEqual(customOne, customTwo, labelKey)).toBe(true);
    expect(areEqual(customOne, customThree, labelKey)).toBe(false);
  });
});
