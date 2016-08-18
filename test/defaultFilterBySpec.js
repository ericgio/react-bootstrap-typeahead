import {expect} from 'chai';
import {last} from 'lodash';

import defaultFilterBy from '../src/defaultFilterBy';
import states from '../example/exampleData';

const labelKey = 'name';

let multiple = false;
let selected = [];
let text = 'Ca';

describe('defaultFilterBy', () => {

  it('returns filtered results for an array of objects', () => {
    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, multiple, selected, text)
    ));

    expect(results).to.deep.equal([
      {name: 'California', population: 37254503},
      {name: 'North Carolina', population: 9535692},
      {name: 'South Carolina', population: 4625401},
    ]);
  });

  it('returns filtered results for an array of strings', () => {
    const options = states.map(s => s.name);
    const results = options.filter(state => (
      defaultFilterBy(state, labelKey, multiple, selected, text)
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
      defaultFilterBy(state, labelKey, multiple, selected, text)
    ));
    expect(results.length).to.equal(0);
  });

  it('returns the selected option if the text matches', () => {
    selected = [{name: 'California', population: 37254503}];
    text = 'California';

    const results = states.filter(state => (
      defaultFilterBy(state, labelKey, multiple, selected, text)
    ));

    expect(results.length).to.equal(1);
    expect(results[0][labelKey]).to.equal(text);
  });

  it(
    'returns no results if `multiple=true` and the text only matches ' +
    'selected results',
    () => {
      multiple = true;
      selected = states.slice(0, 4);
      text = 'Ala';

      const results = states.filter(state => (
        defaultFilterBy(state, labelKey, multiple, selected, text)
      ));

      expect(results.length).to.equal(0);
    }
  );
});
