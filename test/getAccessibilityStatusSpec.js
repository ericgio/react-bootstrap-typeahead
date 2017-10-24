import {expect} from 'chai';
import {getAccessibilityStatus} from '../src/utils/';

describe('getAccessibilityStatus', () => {
  it('displays the number of selections when the menu is hidden', () => {
    const selectionString = '0 selections';
    const status = getAccessibilityStatus([], false, {
      a11yNumSelected: (selected) => selectionString,
      selected: [],
    });
    expect(status).to.equal(selectionString);
  });

  it('displays the emptyLabel string when there are no results', () => {
    const emptyLabel = 'No results';
    const status = getAccessibilityStatus([], true, {emptyLabel});
    expect(status).to.equal(emptyLabel);
  });

  it('displays the number of results when the menu is shown', () => {
    const resultString = '1 result';
    const status = getAccessibilityStatus([1], true, {
      a11yNumResults: (results) => resultString,
    });
    expect(status).to.equal(resultString);
  });
});
