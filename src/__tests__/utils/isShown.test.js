import isShown from '../../utils/isShown';

const baseProps = {
  minLength: 0,
  showMenu: false,
  text: '',
};

describe('isShown', () => {
  it('shows the menu', () => {
    expect(isShown({ ...baseProps, showMenu: true })).toBe(true);
  });

  it('shows the menu when `open` is true', () => {
    expect(isShown({ ...baseProps, open: true })).toBe(true);
  });

  it('hides the menu when `open` is false', () => {
    const props = {
      ...baseProps,
      open: false,
      showMenu: true,
    };

    expect(isShown(props)).toBe(false);
  });

  it('hides the menu when `showMenu` is false', () => {
    expect(isShown(baseProps)).toBe(false);
  });

  it('hides the menu when the input value is less than `minLength`', () => {
    const props = {
      ...baseProps,
      minLength: 1,
      showMenu: true,
    };

    expect(isShown(props)).toBe(false);
  });
});
