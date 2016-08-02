import {expect} from 'chai';

import getFilteredOptions from '../src/getFilteredOptions';
import states from '../example/exampleData';

let props = {
  labelKey: 'name',
  minLength: 0,
};

describe('getFilteredOptions', () => {

  it('returns some filtered results', () => {
    const filteredOptions = getFilteredOptions(states, 'Ca', [], props);
    expect(filteredOptions).to.deep.equal([
      {name: 'California', population: 37254503},
      {name: 'North Carolina', population: 9535692},
      {name: 'South Carolina', population: 4625401},
    ]);
  });

  it('returns no results if the text doesn\'t find a match', () => {
    const filteredOptions = getFilteredOptions(states, 'zzz', [], props);
    expect(filteredOptions.length).to.equal(0);
  });

  it('returns the selected option if the text matches', () => {
    const text = 'California';
    const filteredOptions = getFilteredOptions(
      states,
      text,
      [{name: 'California', population: 37254503}],
      props
    );
    expect(filteredOptions.length).to.equal(1);
    expect(filteredOptions[0][props.labelKey]).to.equal(text);
  });

  it(
    'returns no results if `multiple=true` and the text only matches ' +
    'selected results',
    () => {
      props.multiple = true;
      const filteredOptions = getFilteredOptions(
        states,
        'Ala',
        states.slice(0, 4),
        props
      );
      expect(filteredOptions.length).to.equal(0);
    }
  );

  it('returns an empty result set if `minLength` is not met', () => {
    props.minLength = 3;
    const filteredOptions = getFilteredOptions(states, 'Ca', [], props);
    expect(filteredOptions.length).to.equal(0);
  });

  it('returns a custom option if `allowNew=true`', () => {
    const text = 'zzz';
    props.allowNew = true;
    const filteredOptions = getFilteredOptions(states, text, [], props);

    expect(filteredOptions.length).to.equal(1);
    expect(filteredOptions[0][props.labelKey]).to.equal(text);
    expect(filteredOptions[0].customOption).to.be.true;
  });

});
