import {expect} from 'chai';

import isSelectable from '../../src/utils/isSelectable';

describe('isSelectable', () => {
  it('identifies selectable elements', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'text');
    expect(isSelectable(input)).to.equal(true);

    input.setAttribute('type', 'search');
    expect(isSelectable(input)).to.equal(true);

    input.setAttribute('type', 'password');
    expect(isSelectable(input)).to.equal(true);

    input.setAttribute('type', 'tel');
    expect(isSelectable(input)).to.equal(true);

    input.setAttribute('type', 'url');
    expect(isSelectable(input)).to.equal(true);

    const textarea = document.createElement('textarea');
    expect(isSelectable(textarea)).to.equal(true);
  });

  it('identifies non-selectable inputs', () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'email');
    expect(isSelectable(input)).to.equal(false);

    input.setAttribute('type', 'number');
    expect(isSelectable(input)).to.equal(false);

    const div = document.createElement('div');
    expect(isSelectable(div)).to.equal(false);
  });
});
