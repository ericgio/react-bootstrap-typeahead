import {expect} from 'chai';
import {last} from 'lodash';

import addCustomOption from '../src/utils/addCustomOption';
import states from '../example/exampleData';

const labelKey = 'name';

describe('addCustomOption', () => {

  it('displays a custom option if no matches are found', () => {
    const text = 'zzz';
    const results = addCustomOption(states, text, labelKey);

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('displays a custom option when no exact matches are found', () => {
    const text = 'Ala';
    const results = addCustomOption(states, text, labelKey);

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('does not add a custom option when an exact match is found', () => {
    const text = 'Wyoming';
    const results = addCustomOption(states, text, labelKey);

    expect(results.length).to.equal(50);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.undefined;
  });

});
