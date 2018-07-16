import {expect} from 'chai';
import {last} from 'lodash';

import addCustomOption from '../../src/utils/addCustomOption';
import states from '../../example/exampleData';

const labelKey = 'name';

describe('addCustomOption', () => {
  const defaultProps = {};

  it('displays a custom option if no matches are found', () => {
    const text = 'zzz';
    const results = addCustomOption(states, text, labelKey, defaultProps);

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('adds a custom option when `labelKey` is a function', () => {
    const text = 'zzz';
    const results = addCustomOption(states, text, (o) => o.name, defaultProps);

    expect(results.length).to.equal(51);
    expect(last(results).label).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('displays a custom option when no exact matches are found', () => {
    const text = 'Ala';
    const results = addCustomOption(states, text, labelKey, defaultProps);

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('does not add a custom option when an exact match is found', () => {
    const text = 'Wyoming';
    const results = addCustomOption(states, text, labelKey, defaultProps);

    expect(results.length).to.equal(50);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.undefined;
  });

  it('does add custom option on exact match & includeNewOnMatch=true', () => {
    const text = 'North Carolina';
    const results = addCustomOption(states, text, labelKey,
      {includeNewOnMatch: true});

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.not.be.undefined;
  });
});
