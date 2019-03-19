import isSelectable from '../../utils/isSelectable';

describe('isSelectable', () => {
  test('identifies selectable elements', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'text');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'search');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'password');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'tel');
    expect(isSelectable(input)).toBe(true);

    input.setAttribute('type', 'url');
    expect(isSelectable(input)).toBe(true);

    const textarea = document.createElement('textarea');

    // Must explicitly set selection range for `selectionStart` to have a value.
    textarea.setSelectionRange(0, 0);

    expect(isSelectable(textarea)).toBe(true);
  });

  test('identifies non-selectable inputs', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'email');
    expect(isSelectable(input)).toBe(false);

    input.setAttribute('type', 'number');
    expect(isSelectable(input)).toBe(false);

    const div = document.createElement('div');
    expect(isSelectable(div)).toBe(false);
  });
});
