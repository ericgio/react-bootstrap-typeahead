import {expect} from 'chai';

import getTruncatedOptions from '../../src/utils/getTruncatedOptions';
import {bigDataSet} from '../helpers';

describe('getTruncatedOptions', () => {

  it('truncates the results', () => {
    const maxResults = 100;
    const truncatedResults = getTruncatedOptions(bigDataSet, maxResults);

    expect(truncatedResults.length).to.equal(maxResults);
  });

  it('does not truncate the results if the threshold is not met', () => {
    const maxResults = 400;
    const truncatedResults = getTruncatedOptions(bigDataSet, maxResults);

    expect(truncatedResults.length).to.equal(bigDataSet.length);
  });

  it('does not truncate the results if `maxResults=0`', () => {
    const maxResults = 0;
    const truncatedResults = getTruncatedOptions(bigDataSet, maxResults);

    expect(truncatedResults.length).to.equal(bigDataSet.length);
  });

});
