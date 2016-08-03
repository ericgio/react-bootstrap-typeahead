import {expect} from 'chai';
import {last} from 'lodash';

import getFilteredOptions from '../src/getFilteredOptions';
import states from '../example/exampleData';

let props = {
  labelKey: 'name',
  minLength: 0,
};

describe('getFilteredOptions', () => {

  it('returns filtered results for an array of objects', () => {
    const filteredOptions = getFilteredOptions(states, 'Ca', [], props);
    expect(filteredOptions).to.deep.equal([
      {name: 'California', population: 37254503},
      {name: 'North Carolina', population: 9535692},
      {name: 'South Carolina', population: 4625401},
    ]);
  });

  it('returns filtered results for an array of strings', () => {
    const options = states.map(s => s.name);
    const filteredOptions = getFilteredOptions(options, 'Ca', [], props);
    expect(filteredOptions).to.deep.equal([
      'California',
      'North Carolina',
      'South Carolina',
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

  it('displays a custom option if no matches are found', () => {
    const text = 'zzz';
    props.allowNew = true;
    const filteredOptions = getFilteredOptions(states, text, [], props);

    expect(filteredOptions.length).to.equal(1);
    expect(filteredOptions[0][props.labelKey]).to.equal(text);
    expect(filteredOptions[0].customOption).to.be.true;
  });

  it('displays a custom option when no exact matches are found', () => {
    const text = 'Ala';
    props.allowNew = true;
    const filteredOptions = getFilteredOptions(states, text, [], props);

    expect(filteredOptions.length).to.equal(3); // Alabama, Alaska, [Custom]
    expect(last(filteredOptions)[props.labelKey]).to.equal(text);
    expect(last(filteredOptions).customOption).to.be.true;
  });

});
