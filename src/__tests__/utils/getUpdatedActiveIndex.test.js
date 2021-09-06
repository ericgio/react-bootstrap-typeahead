import getUpdatedActiveIndex from '../../utils/getUpdatedActiveIndex';

const results = [
  { name: 'foo' },
  { disabled: true, name: 'bar' },
  { disabled: true, name: 'boo' },
  { name: 'baz' },
];

describe('getUpdatedActiveIndex', () => {
  it('updates the active index', () => {
    expect(getUpdatedActiveIndex(-1, 'ArrowDown', results)).toBe(0);
    expect(getUpdatedActiveIndex(0, 'ArrowDown', results)).toBe(3);
    expect(getUpdatedActiveIndex(3, 'ArrowDown', results)).toBe(-1);

    expect(getUpdatedActiveIndex(-1, 'ArrowUp', results)).toBe(3);
    expect(getUpdatedActiveIndex(3, 'ArrowUp', results)).toBe(0);
    expect(getUpdatedActiveIndex(0, 'ArrowUp', results)).toBe(-1);
  });
});
