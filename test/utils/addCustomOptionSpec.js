import {expect} from 'chai';
import {last} from 'lodash';
import sinon from 'sinon';

import addCustomOption from '../../src/utils/addCustomOption';
import states from '../../example/exampleData';

const labelKey = 'name';

describe('addCustomOption', () => {
  const defaultProps = {allowNew: true, labelKey};

  it('displays a custom option if no matches are found', () => {
    const text = 'zzz';
    const results = addCustomOption(states, {...defaultProps, text});

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('adds a custom option when `labelKey` is a function', () => {
    const text = 'zzz';
    const results = addCustomOption(states, {...defaultProps, labelKey: (o) => o.name, text});

    expect(results.length).to.equal(51);
    expect(last(results).label).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('displays a custom option when no exact matches are found', () => {
    const text = 'Ala';
    const results = addCustomOption(states, {...defaultProps, text});

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.true;
  });

  it('does not add a custom option when an exact match is found', () => {
    const text = 'Wyoming';
    const results = addCustomOption(states, {...defaultProps, text});

    expect(results.length).to.equal(50);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.undefined;
  });

  it('passes correct parameters when allowNew is a function', () => {
    const allowNew = sinon.spy(() => { return true; });
    const text = 'North Carolina';
    const results = addCustomOption(states, {allowNew, labelKey, text});

    expect(results.length).to.equal(51);
    expect(allowNew.calledOnce).to.equal(true);
    expect(allowNew.firstCall.args[0]).to.eql(states);
    expect(allowNew.firstCall.args[1]).to.deep.eql({
      labelKey,
      text,
    });
  });

  it('does add custom option when allowNew returns true', () => {
    const text = 'North Carolina';
    const results = addCustomOption(states,
      {allowNew: () => { return true; }, labelKey, text});

    expect(results.length).to.equal(51);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.not.be.undefined;
  });

  it('does not custom option when allowNew returns false', () => {
    const text = 'Wyoming';
    const results = addCustomOption(states,
      {allowNew: () => { return false; }, labelKey, text});

    expect(results.length).to.equal(50);
    expect(last(results)[labelKey]).to.equal(text);
    expect(last(results).customOption).to.be.undefined;
  });
});
