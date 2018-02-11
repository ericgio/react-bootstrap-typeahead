import {expect} from 'chai';
import {getAccessibilityStatus} from '../src/utils/';

describe('getAccessibilityStatus', () => {
  it('displays the number of selections when the menu is hidden', () => {
    const selectionString = '0 selections';
    const status = getAccessibilityStatus({
      a11yNumSelected: (selected) => selectionString,
      isMenuShown: false,
      results: [],
      selected: [],
    });
    expect(status).to.equal(selectionString);
  });

  it('displays the emptyLabel string when there are no results', () => {
    const emptyLabel = 'No results';
    const status = getAccessibilityStatus({
      emptyLabel,
      isMenuShown: true,
      results: [],
    });
    expect(status).to.equal(emptyLabel);
  });

  it('displays the number of results when the menu is shown', () => {
    const resultString = '1 result';
    const status = getAccessibilityStatus({
      a11yNumResults: (results) => resultString,
      isMenuShown: true,
      results: [1],
    });
    expect(status).to.equal(resultString);
  });
});
