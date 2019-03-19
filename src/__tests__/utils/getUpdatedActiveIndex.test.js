import getUpdatedActiveIndex from '../../utils/getUpdatedActiveIndex';
import { DOWN, UP } from '../../constants';

const results = [
  { name: 'foo' },
  { disabled: true, name: 'bar' },
  { disabled: true, name: 'boo' },
  { name: 'baz' },
];

describe('getUpdatedActiveIndex', () => {
  test('updates the active index', () => {
    expect(getUpdatedActiveIndex(-1, DOWN, results)).toBe(0);
    expect(getUpdatedActiveIndex(0, DOWN, results)).toBe(3);
    expect(getUpdatedActiveIndex(3, DOWN, results)).toBe(-1);

    expect(getUpdatedActiveIndex(-1, UP, results)).toBe(3);
    expect(getUpdatedActiveIndex(3, UP, results)).toBe(0);
    expect(getUpdatedActiveIndex(0, UP, results)).toBe(-1);
  });
});
