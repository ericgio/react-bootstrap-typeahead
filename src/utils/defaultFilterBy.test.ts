import defaultFilterBy from './defaultFilterBy';
import states from '../tests/data';

const FILTERED_RESULTS = [
  /* eslint-disable sort-keys */
  {
    name: 'California',
    population: 37254503,
    capital: 'Sacramento',
    region: 'West',
  },
  {
    name: 'North Carolina',
    population: 9535692,
    capital: 'Raleigh',
    region: 'South',
  },
  {
    name: 'South Carolina',
    population: 4625401,
    capital: 'Columbia',
    region: 'South',
  },
  /* eslint-enable sort-keys */
];

const defaultOptions = states;
const languageOptions = ['Español', 'Français'];

const labelKeyFn = (o) => o.name;

const defaultProps = {
  caseSensitive: false,
  filterBy: [],
  ignoreDiacritics: true,
  labelKey: 'name',
  multiple: false,
  selected: [],
  text: 'Ca',
};

const propsWithLabelKeyFn = { ...defaultProps, labelKey: labelKeyFn };

describe('defaultFilterBy', () => {
  it('filters an array of objects', () => {
    const results = defaultOptions.filter((o) =>
      defaultFilterBy(o, defaultProps)
    );
    expect(results).toEqual(FILTERED_RESULTS);
  });

  describe('when `labelKey` is a function', () => {
    it('returns a set of results', () => {
      const results = defaultOptions.filter((o) =>
        defaultFilterBy(o, propsWithLabelKeyFn)
      );
      expect(results).toEqual(FILTERED_RESULTS);
    });

    it("returns no results if the text doesn't find a match", () => {
      const props = { ...propsWithLabelKeyFn, text: 'zzz' };
      const results = defaultOptions.filter((o) => defaultFilterBy(o, props));
      expect(results.length).toBe(0);
    });

    it('does not include string options in the results', () => {
      const map = {
        abcd1: 'Eric',
        efgh2: 'Paul',
        ijkl3: 'Tom',
      };

      const options = Object.keys(map);

      const results = options.filter((option) =>
        defaultFilterBy(option, {
          ...defaultProps,
          labelKey: (o: string) => map[o],
          text: 'e',
        })
      );
      expect(results).toEqual(['abcd1']);
    });
  });

  it('returns case-sensitive filtered results', () => {
    const props = { ...defaultProps, caseSensitive: true, text: 'alab' };
    const results = defaultOptions.filter((o) => defaultFilterBy(o, props));

    expect(results.length).toBe(0);
  });

  it('filters based on a set of fields and returns results', () => {
    const props = {
      ...defaultProps,
      filterBy: ['name', 'capital'],
      text: 'sacr',
    };
    const results = defaultOptions.filter((o) => defaultFilterBy(o, props));

    expect(results).toEqual(FILTERED_RESULTS.slice(0, 1));
  });

  it('filters an array of strings', () => {
    const stringOptions = defaultOptions.map((o) => o.name);
    const results = stringOptions.filter((o) =>
      defaultFilterBy(o, defaultProps)
    );

    expect(results).toEqual(['California', 'North Carolina', 'South Carolina']);
  });

  it("returns no results if the text doesn't find a match", () => {
    const props = { ...defaultProps, text: 'zzz' };
    const results = defaultOptions.filter((o) => defaultFilterBy(o, props));
    expect(results.length).toBe(0);
  });

  it('returns the option if the text matches exactly', () => {
    const props = { ...defaultProps, text: 'California' };
    const results = defaultOptions.filter((o) => defaultFilterBy(o, props));

    expect(results.length).toBe(1);
    expect(results[0][props.labelKey]).toBe(props.text);
  });

  it(
    'returns no results if `multiple=true` and the text only matches ' +
      'selected results',
    () => {
      const props = {
        ...defaultProps,
        multiple: true,
        selected: [defaultOptions[4]],
        text: 'cali',
      };
      const results = defaultOptions.filter((o) => defaultFilterBy(o, props));
      expect(results.length).toBe(0);
    }
  );

  describe('behavior with diacritical marks', () => {
    it('ignores diacritical marks when filtering', () => {
      const props = { ...defaultProps, text: 'franc' };
      const results = languageOptions.filter((o) => defaultFilterBy(o, props));
      expect(results).toEqual(['Français']);
    });

    it('considers diacritical marks when filtering', () => {
      const props = {
        ...defaultProps,
        ignoreDiacritics: false,
        text: 'franc',
      };
      const results = languageOptions.filter((o) => defaultFilterBy(o, props));
      expect(results.length).toBe(0);
    });
  });

  it('gracefully handles invalid labels', () => {
    const spy = jest.spyOn(console, 'error');

    const options = [{ name: 'foo' }];
    const props = { ...defaultProps, labelKey: 'label' };
    const results = options.filter((o) => defaultFilterBy(o, props));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(results.length).toBe(0);

    spy.mockRestore();
  });
});
