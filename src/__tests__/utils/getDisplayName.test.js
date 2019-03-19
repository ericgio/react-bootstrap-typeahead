import React from 'react';
import getDisplayName from '../../utils/getDisplayName';

const displayName = 'AnotherName';
const anonymize = (Component) => () => <Component />;
const NamedComponent = (props) => <div />;

describe('getDisplayName', () => {
  test('returns the displayName of the component', () => {
    expect(getDisplayName(NamedComponent)).toBe('NamedComponent');

    NamedComponent.displayName = displayName;
    expect(getDisplayName(NamedComponent)).toBe(displayName);

    // HOCs will obscure the name and displayName.
    expect(getDisplayName(anonymize(NamedComponent))).toBe('Component');
  });
});
