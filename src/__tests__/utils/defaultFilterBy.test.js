import defaultFilterBy from '../../utils/defaultFilterBy';
import states from '../data';

const FILTERED_RESULTS = [
  /* eslint-disable max-len, sort-keys */
  { name: 'California', population: 37254503, capital: 'Sacramento', region: 'West' },
  { name: 'North Carolina', population: 9535692, capital: 'Raleigh', region: 'South' },
  { name: 'South Carolina', population: 4625401, capital: 'Columbia', region: 'South' },
  /* eslint-enable max-len, sort-keys */
];

describe('defaultFilterBy', () => {
  let options, props;

  beforeEach(() => {
    options = states;
    props = {
      caseSensitive: false,
      filterBy: [],
      ignoreDiacritics: true,
      labelKey: 'name',
      multiple: false,
      selected: [],
      text: 'Ca',
    };
  });

  test('filters an array of objects', () => {
    const results = options.filter((o) => defaultFilterBy(o, props));
    expect(results).toEqual(FILTERED_RESULTS);
  });

  describe('when `labelKey` is a function', () => {
    beforeEach(() => {
      props = { ...props, labelKey: (o) => o.name };
    });

    test('returns a set of results', () => {
      const results = options.filter((o) => defaultFilterBy(o, props));
      expect(results).toEqual(FILTERED_RESULTS);
    });

    test('returns no results if the text doesn\'t find a match', () => {
      props = { ...props, text: 'zzz' };
      const results = options.filter((o) => defaultFilterBy(o, props));
      expect(results.length).toBe(0);
    });
  });

  test('returns case-sensitive filtered results', () => {
    props = { ...props, caseSensitive: true, text: 'alab' };
    const results = options.filter((o) => defaultFilterBy(o, props));

    expect(results.length).toBe(0);
  });

  test('filters based on a set of fields and returns results', () => {
    props = { ...props, filterBy: ['name', 'capital'], text: 'sacr' };
    const results = options.filter((o) => defaultFilterBy(o, props));

    expect(results).toEqual(FILTERED_RESULTS.slice(0, 1));
  });

  test('filters an array of strings', () => {
    const stringOptions = options.map((o) => o.name);
    const results = stringOptions.filter((o) => (
      defaultFilterBy(o, props)
    ));

    expect(results).toEqual([
      'California',
      'North Carolina',
      'South Carolina',
    ]);
  });

  test('returns no results if the text doesn\'t find a match', () => {
    props = { ...props, text: 'zzz' };
    const results = options.filter((o) => defaultFilterBy(o, props));
    expect(results.length).toBe(0);
  });

  test('returns the option if the text matches exactly', () => {
    props = { ...props, text: 'California' };
    const results = options.filter((o) => defaultFilterBy(o, props));

    expect(results.length).toBe(1);
    expect(results[0][props.labelKey]).toBe(props.text);
  });

  test(
    'returns no results if `multiple=true` and the text only matches ' +
    'selected results',
    () => {
      props = {
        ...props,
        multiple: true,
        selected: [options[4]],
        text: 'cali',
      };
      const results = options.filter((o) => defaultFilterBy(o, props));
      expect(results.length).toBe(0);
    }
  );

  describe('behavior with diacritical marks', () => {
    beforeEach(() => {
      options = ['Español', 'Français'];
      props = { ...props, text: 'franc' };
    });

    test('ignores diacritical marks when filtering', () => {
      const results = options.filter((o) => defaultFilterBy(o, props));
      expect(results).toEqual(['Français']);
    });

    test('considers diacritical marks when filtering', () => {
      props = { ...props, ignoreDiacritics: false };
      const results = options.filter((o) => defaultFilterBy(o, props));
      expect(results.length).toBe(0);
    });
  });

  test('gracefully handles invalid labels', () => {
    const spy = jest.spyOn(console, 'error');

    options = [{ name: 'foo' }];
    props = { ...props, labelKey: 'label' };
    const results = options.filter((o) => defaultFilterBy(o, props));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(results.length).toBe(0);

    spy.mockRestore();
  });
});
