import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import Token from '../../src/components/Token.react';

describe('<Token>', () => {
  let token;

  beforeEach(() => {
    token = mount(<Token>This is a token</Token>);
  });

  test('renders a basic token', () => {
    expect(token.find('div').hasClass('rbt-token')).toBe(true);
    expect(token.text()).toBe('This is a token');
  });

  test('renders a removeable token', () => {
    const onRemove = sinon.spy();

    token.setProps({ onRemove });

    const rootNode = token.find('.rbt-token');
    expect(rootNode.hasClass('rbt-token-removeable')).toBe(true);

    const closeButton = token.find('button');
    closeButton.simulate('click');

    expect(closeButton.hasClass('rbt-token-remove-button')).toBe(true);
    expect(onRemove.calledOnce).toBe(true);
  });
});
