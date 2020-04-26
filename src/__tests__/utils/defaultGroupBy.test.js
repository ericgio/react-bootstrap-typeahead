import defaultGroupBy from '../../utils/defaultGroupBy';
import states from '../data';

describe('defaultGroupBy', () => {
  let options;

  beforeEach(() => {
    options = states;
  });

  test('filters an array of objects', () => {
    const results = defaultGroupBy('region')(options);
    const groups = Object.keys(results);
    expect(groups).toEqual(['South', 'West', 'Northeast', 'Midwest']);
  });
});
