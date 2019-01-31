import { expect } from 'chai';

import getIsOnlyResult from '../../src/utils/getIsOnlyResult';

describe('getIsOnlyResult', () => {
  let props;

  beforeEach(() => {
    props = {
      allowNew: false,
      highlightOnlyResult: true,
      results: ['The only result!'],
    };
  });

  it('returns true', () => {
    expect(getIsOnlyResult(props)).to.equal(true);
  });

  it('returns false when `highlightOnlyResult` is disabled', () => {
    props.highlightOnlyResult = false;
    expect(getIsOnlyResult(props)).to.equal(false);
  });

  it('returns false when custom options are allowed', () => {
    props.allowNew = true;
    expect(getIsOnlyResult(props)).to.equal(false);
  });

  it('returns false when there are more or less than one result', () => {
    props.results = ['One', 'Two'];
    expect(getIsOnlyResult(props)).to.equal(false);

    props.results = [];
    expect(getIsOnlyResult(props)).to.equal(false);
  });

  it('returns false when the only result is disabled', () => {
    props.results = [{ disabled: true }];
    expect(getIsOnlyResult(props)).to.equal(false);
  });
});
