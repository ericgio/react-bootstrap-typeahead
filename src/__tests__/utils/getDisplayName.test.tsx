import React, { FC } from 'react';
import getDisplayName from '../../utils/getDisplayName';

const displayName = 'AnotherName';
const anonymize = (Component) => () => <Component />;
const NamedComponent = () => <div />;

describe('getDisplayName', () => {
  it('returns the displayName of the component', () => {
    expect(getDisplayName(NamedComponent)).toBe('NamedComponent');

    (NamedComponent as FC).displayName = displayName;
    expect(getDisplayName(NamedComponent)).toBe(displayName);

    // HOCs will obscure the name and displayName.
    expect(getDisplayName(anonymize(NamedComponent))).toBe('Component');
  });
});
