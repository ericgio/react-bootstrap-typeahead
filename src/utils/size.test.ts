import { isSizeLarge, isSizeSmall } from './size';

describe('size', () => {
  it('tests `isSizeLarge` behavior', () => {
    expect(isSizeLarge('lg')).toBe(true);

    expect(isSizeLarge()).toBe(false);
    expect(isSizeLarge(null)).toBe(false);
    expect(isSizeLarge('lrg')).toBe(false);
  });

  it('tests `isSizeSmall` behavior', () => {
    expect(isSizeSmall('sm')).toBe(true);

    expect(isSizeSmall()).toBe(false);
    expect(isSizeSmall(null)).toBe(false);
    expect(isSizeSmall('sml')).toBe(false);
  });
});
