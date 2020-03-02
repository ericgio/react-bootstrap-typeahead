import { isSizeLarge, isSizeSmall } from '../../utils/size';

describe('size', () => {
  test('isSizeLarge', () => {
    expect(isSizeLarge('large')).toBe(true);
    expect(isSizeLarge('lg')).toBe(true);

    expect(isSizeLarge()).toBe(false);
    expect(isSizeLarge(null)).toBe(false);
    expect(isSizeLarge('lrg')).toBe(false);
  });

  test('isSizeSmall', () => {
    expect(isSizeSmall('small')).toBe(true);
    expect(isSizeSmall('sm')).toBe(true);

    expect(isSizeSmall()).toBe(false);
    expect(isSizeSmall(null)).toBe(false);
    expect(isSizeSmall('sml')).toBe(false);
  });
});
