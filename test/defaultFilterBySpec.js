import {expect} from 'chai';

import defaultFilterBy from '../src/utils/defaultFilterBy';
import states from '../example/exampleData';

const labelKey = 'name';

let filterOptions = {
  caseSensitive: false,
  fields: [],
};
let isTokenized = false;
let text = 'Ca';

describe('defaultFilterBy', () => {

  it('returns filtered results for an array of objects', () => {
    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, text, filterOptions)
    ));

    expect(results).to.deep.equal([
      /* eslint-disable max-len */
      {name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
      {name: 'North Carolina', population: 9535692, capital: 'Raleigh', region: 'South'},
      {name: 'South Carolina', population: 4625401, capital: 'Columbia', region: 'South'},
      /* eslint-enable max-len */
    ]);
  });

  it('returns filtered results for an array of objects,' +
    'when labelKey is a function',
    () => {
      const labelKeyFunc = o => o.name;
      const results = states.filter(state => (
      defaultFilterBy(state, labelKeyFunc, isTokenized, text, filterOptions)
    ));

      expect(results).to.deep.equal([
        /* eslint-disable max-len */
        {name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
        {name: 'North Carolina', population: 9535692, capital: 'Raleigh', region: 'South'},
        {name: 'South Carolina', population: 4625401, capital: 'Columbia', region: 'South'},
        /* eslint-enable max-len */
      ]);
    }
  );

  it('returns case-sensitive filtered results', () => {
    const options = {...filterOptions, caseSensitive: true};
    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, 'alab', options)
    ));

    expect(results.length).to.equal(0);
  });

  it('searches a set of fields and returns results', () => {
    const options = {...filterOptions, fields: ['name', 'capital']};
    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, 'sacr', options)
    ));

    expect(results).to.deep.equal([
      /* eslint-disable max-len */
      {name: 'California', population: 37254503, capital: 'Sacramento', region: 'West'},
      /* eslint-enable max-len */
    ]);
  });

  it('returns filtered results for an array of strings', () => {
    const options = states.map(s => s.name);
    const results = options.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, text, filterOptions)
    ));

    expect(results).to.deep.equal([
      'California',
      'North Carolina',
      'South Carolina',
    ]);
  });

  it('returns no results if the text doesn\'t find a match', () => {
    text = 'zzz';
    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, text, filterOptions)
    ));
    expect(results.length).to.equal(0);
  });

  it('returns no results if the text doesn\'t find a match', () => {
    text = 'zzz';
    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, text, filterOptions)
    ));
    expect(results.length).to.equal(0);
  });

  it('returns no results if the text doesn\'t find a match,' +
    'when labelKey is a function',
    () => {
      const labelKeyFunc = o => o.name;
      text = 'zzz';
      const results = states.filter(state => (
        defaultFilterBy(state, labelKeyFunc, isTokenized, text, filterOptions)
      ));
      expect(results.length).to.equal(0);
    }
  );

  it('returns the option if the text matches exactly', () => {
    text = 'California';

    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, isTokenized, text, filterOptions)
    ));

    expect(results.length).to.equal(1);
    expect(results[0][labelKey]).to.equal(text);
  });

  it(
    'returns no results if `multiple=true` and the text only matches ' +
    'selected results',
    () => {
      const results = states.filter(state => (
        defaultFilterBy(state, labelKey, true, 'Alab', filterOptions)
      ));

      expect(results.length).to.equal(0);
    }
  );
});
