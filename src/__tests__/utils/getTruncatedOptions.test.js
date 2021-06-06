import getTruncatedOptions from '../../utils/getTruncatedOptions';
import options from '../data';

describe('getTruncatedOptions', () => {
  it('truncates the results', () => {
    const maxResults = 10;
    const truncatedResults = getTruncatedOptions(options, maxResults);

    expect(truncatedResults.length).toBe(maxResults);
  });

  it('does not truncate the results if the threshold is not met', () => {
    const maxResults = 100;
    const truncatedResults = getTruncatedOptions(options, maxResults);

    expect(truncatedResults.length).toBe(options.length);
  });

  it('does not truncate the results if `maxResults=0`', () => {
    const maxResults = 0;
    const truncatedResults = getTruncatedOptions(options, maxResults);

    expect(truncatedResults.length).toBe(options.length);
  });
});
