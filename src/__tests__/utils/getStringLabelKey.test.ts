import getStringLabelKey from '../../utils/getStringLabelKey';

describe('getStringLabelKey', () => {
  it('returns the specified string labelKey', () => {
    expect(getStringLabelKey('name')).toBe('name');
  });

  it('returns the default labelKey when `labelKey` is a function', () => {
    // @ts-ignore
    expect(getStringLabelKey((o) => o.name)).toBe('label');
  });
});
