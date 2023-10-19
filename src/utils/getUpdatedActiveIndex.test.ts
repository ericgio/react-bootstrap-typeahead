import getUpdatedActiveIndex, {
  isDisabledOption,
  skipDisabledOptions,
} from './getUpdatedActiveIndex';

const options = [
  { name: 'foo' },
  { disabled: true, name: 'bar' },
  { disabled: true, name: 'boo' },
  { name: 'baz', disabled: false },
  { name: 'bja', disabled: undefined },
];

const stringOptions = ['foo', 'bar', 'baz'];

test('getUpdatedActiveIndex', () => {
  expect(getUpdatedActiveIndex(-1, 'ArrowDown', options)).toBe(0);
  expect(getUpdatedActiveIndex(0, 'ArrowDown', options)).toBe(3);
  expect(getUpdatedActiveIndex(3, 'ArrowDown', options)).toBe(4);
  expect(getUpdatedActiveIndex(4, 'ArrowDown', options)).toBe(-1);

  expect(getUpdatedActiveIndex(-1, 'ArrowUp', options)).toBe(4);
  expect(getUpdatedActiveIndex(4, 'ArrowUp', options)).toBe(3);
  expect(getUpdatedActiveIndex(3, 'ArrowUp', options)).toBe(0);
  expect(getUpdatedActiveIndex(0, 'ArrowUp', options)).toBe(-1);
});

test('skipDisabledOptions', () => {
  expect(skipDisabledOptions(0, 'ArrowDown', options)).toBe(0);
  expect(skipDisabledOptions(0, 'ArrowUp', options)).toBe(0);

  expect(skipDisabledOptions(1, 'ArrowDown', options)).toBe(3);
  expect(skipDisabledOptions(1, 'ArrowUp', options)).toBe(0);

  expect(skipDisabledOptions(1, 'ArrowDown', stringOptions)).toBe(1);
  expect(skipDisabledOptions(1, 'ArrowUp', stringOptions)).toBe(1);
});

test('isDisabledOption', () => {
  expect(isDisabledOption(0, options)).toBe(false);
  expect(isDisabledOption(1, options)).toBe(true);
  expect(isDisabledOption(3, options)).toBe(false);
  expect(isDisabledOption(4, options)).toBe(false);
  expect(isDisabledOption(6, options)).toBe(false);
  expect(isDisabledOption(0, stringOptions)).toBe(false);
});
