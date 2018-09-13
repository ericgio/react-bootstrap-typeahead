import {expect} from 'chai';

import isShown from '../../src/utils/isShown';
import options from '../../example/exampleData';

const baseProps = {
  emptyLabel: 'No matches found.',
  minLength: 0,
  showMenu: false,
  text: '',
};

describe('isShown', () => {
  it('shows the menu', () => {
    expect(isShown(options, {...baseProps, showMenu: true})).to.equal(true);
  });

  it('hides the menu when `showMenu` is false', () => {
    expect(isShown(options, baseProps)).to.equal(false);
  });

  it('hides the menu when the input value is less than `minLength`', () => {
    const props = {
      ...baseProps,
      minLength: 1,
      showMenu: true,
    };

    expect(isShown(options, props)).to.equal(false);
  });

  it('hides the menu when there are no results and no empty label', () => {
    expect(isShown([], {...baseProps, emptyLabel: ''})).to.equal(false);
  });
});
