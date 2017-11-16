import {expect} from 'chai';

import defaultFilterBy from '../src/utils/defaultFilterBy';
import states from '../example/exampleData';

describe('defaultFilterBy', () => {
  let options, props, state;

  beforeEach(() => {
    options = states;
    props = {
      caseSensitive: false,
      filterBy: [],
      ignoreDiacritics: true,
      labelKey: 'name',
      multiple: false,
    };

    state = {
      selected: [],
      text: 'Ca',
    };
  });

  it('filters an array of objects', () => {
    const results = options.filter((o) => defaultFilterBy(o, state, props));
    expect(results).to.deep.equal([
      /* eslint-disable max-len */
      {name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
      {name: 'North Carolina', population: 9535692, capital: 'Raleigh', region: 'South'},
      {name: 'South Carolina', population: 4625401, capital: 'Columbia', region: 'South'},
      /* eslint-enable max-len */
    ]);
  });

  describe('when `labelKey` is a function', () => {
    beforeEach(() => {
      props = {...props, labelKey: (o) => o.name};
    });

    it('returns a set of results', () => {
      const results = options.filter((o) => defaultFilterBy(o, state, props));
      expect(results).to.deep.equal([
        /* eslint-disable max-len */
        {name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
        {name: 'North Carolina', population: 9535692, capital: 'Raleigh', region: 'South'},
        {name: 'South Carolina', population: 4625401, capital: 'Columbia', region: 'South'},
        /* eslint-enable max-len */
      ]);
    });

    it('returns no results if the text doesn\'t find a match', () => {
      state = {...state, text: 'zzz'};
      const results = options.filter((o) => defaultFilterBy(o, state, props));
      expect(results.length).to.equal(0);
    });
  });

  it('returns case-sensitive filtered results', () => {
    props = {...props, caseSensitive: true};
    state = {...state, text: 'alab'};
    const results = options.filter((o) => defaultFilterBy(o, state, props));

    expect(results.length).to.equal(0);
  });

  it('filters based on a set of fields and returns results', () => {
    props = {...props, filterBy: ['name', 'capital']};
    state = {...state, text: 'sacr'};
    const results = options.filter((o) => defaultFilterBy(o, state, props));

    expect(results).to.deep.equal([
      /* eslint-disable max-len */
      {name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
      /* eslint-enable max-len */
    ]);
  });

  it('filters an array of strings', () => {
    const stringOptions = options.map((o) => o.name);
    const results = stringOptions.filter((o) => (
      defaultFilterBy(o, state, props)
    ));

    expect(results).to.deep.equal([
      'California',
      'North Carolina',
      'South Carolina',
    ]);
  });

  it('returns no results if the text doesn\'t find a match', () => {
    state = {...state, text: 'zzz'};
    const results = options.filter((o) => defaultFilterBy(o, state, props));
    expect(results.length).to.equal(0);
  });

  it('returns the option if the text matches exactly', () => {
    state = {...state, text: 'California'};
    const results = options.filter((o) => defaultFilterBy(o, state, props));

    expect(results.length).to.equal(1);
    expect(results[0][props.labelKey]).to.equal(state.text);
  });

  it(
    'returns no results if `multiple=true` and the text only matches ' +
    'selected results', () => {
      props = {...props, multiple: true};
      state = {...state, selected: [options[4]], text: 'cali'};
      const results = options.filter((o) => defaultFilterBy(o, state, props));
      expect(results.length).to.equal(0);
    }
  );

  describe('behavior with diacritical marks', () => {
    beforeEach(() => {
      options = ['Español', 'Français'];
      state = {...state, text: 'franc'};
    });

    it('ignores diacritical marks when filtering', () => {
      const results = options.filter((o) => defaultFilterBy(o, state, props));
      expect(results).to.deep.equal(['Français']);
    });

    it('considers diacritical marks when filtering', () => {
      props = {...props, ignoreDiacritics: false};
      const results = options.filter((o) => defaultFilterBy(o, state, props));
      expect(results.length).to.equal(0);
    });
  });
});
