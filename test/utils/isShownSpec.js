import { expect } from 'chai';

import isShown from '../../src/utils/isShown';

const baseProps = {
  minLength: 0,
  showMenu: false,
  text: '',
};

describe('isShown', () => {
  it('shows the menu', () => {
    expect(isShown({ ...baseProps, showMenu: true })).to.equal(true);
  });

  it('shows the menu when `open` is true', () => {
    expect(isShown({ ...baseProps, open: true })).to.equal(true);
  });

  it('hides the menu when `open` is false', () => {
    const props = {
      ...baseProps,
      open: false,
      showMenu: true,
    };

    expect(isShown(props)).to.equal(false);
  });

  it('hides the menu when `showMenu` is false', () => {
    expect(isShown(baseProps)).to.equal(false);
  });

  it('hides the menu when the input value is less than `minLength`', () => {
    const props = {
      ...baseProps,
      minLength: 1,
      showMenu: true,
    };

    expect(isShown(props)).to.equal(false);
  });
});
