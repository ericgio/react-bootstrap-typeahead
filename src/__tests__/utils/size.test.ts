import { isSizeLarge, isSizeSmall } from '../../utils/size';

describe('size', () => {
  it('tests `isSizeLarge` behavior', () => {
    expect(isSizeLarge('large')).toBe(true);
    expect(isSizeLarge('lg')).toBe(true);

    expect(isSizeLarge()).toBe(false);
    expect(isSizeLarge(null)).toBe(false);
    expect(isSizeLarge('lrg')).toBe(false);
  });

  it('tests `isSizeSmall` behavior', () => {
    expect(isSizeSmall('small')).toBe(true);
    expect(isSizeSmall('sm')).toBe(true);

    expect(isSizeSmall()).toBe(false);
    expect(isSizeSmall(null)).toBe(false);
    expect(isSizeSmall('sml')).toBe(false);
  });
});
