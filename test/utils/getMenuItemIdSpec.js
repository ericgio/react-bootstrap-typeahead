import { expect } from 'chai';

import { getMenuItemId } from '../../src/utils';

describe('getMenuItemId', () => {
  it('generates an id', () => {
    expect(getMenuItemId('menu-id', 0)).to.equal('menu-id-item-0');
  });
});
