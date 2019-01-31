import { expect } from 'chai';

import { getMenuItemId } from '../../src/utils';

describe('getMenuItemId', () => {
  it('generates an id', () => {
    expect(getMenuItemId(0)).to.equal('rbt-menu-item-0');
  });
});
