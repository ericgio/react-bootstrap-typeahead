import { isSizeLarge, isSizeSmall } from './size';

describe('size', () => {
  it('tests `isSizeLarge` behavior', () => {
    expect(isSizeLarge('lg')).toBe(true);

    expect(isSizeLarge()).toBe(false);
    // @ts-expect-error
    expect(isSizeLarge(null)).toBe(false);
    // @ts-expect-error
    expect(isSizeLarge('lrg')).toBe(false);
  });

  it('tests `isSizeSmall` behavior', () => {
    expect(isSizeSmall('sm')).toBe(true);

    expect(isSizeSmall()).toBe(false);
    // @ts-expect-error
    expect(isSizeSmall(null)).toBe(false);
    // @ts-expect-error
    expect(isSizeSmall('sml')).toBe(false);
  });
});
