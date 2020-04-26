import getGroupByFunction from '../../utils/getGroupByFunction';
import defaultGroupBy from '../../utils/defaultGroupBy';

jest.mock('../../utils/defaultGroupBy');

describe('getGroupByFunction', () => {
  test('handles undefined', () => {
    expect(getGroupByFunction(undefined)).toBeFalsy();
  });

  test('handles function', () => {
    const fn = () => {};
    expect(getGroupByFunction(fn)).toBe(fn);
  });

  test('handles string', () => {
    const fn = () => {};
    defaultGroupBy.mockReturnValue(fn);

    expect(getGroupByFunction('str')).toBe(fn);
    expect(defaultGroupBy).toBeCalledWith('str');
  });
});
