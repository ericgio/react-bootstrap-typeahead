import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import Token from '../../src/Token.react';

describe('<Token>', () => {
  let token;

  beforeEach(() => {
    token = mount(<Token>This is a token</Token>);
  });

  it('renders a basic token', () => {
    expect(token.find('div').hasClass('rbt-token')).to.equal(true);
    expect(token.text()).to.equal('This is a token');
  });

  it('renders a removeable token', () => {
    const onRemove = sinon.spy();

    token.setProps({onRemove});

    const rootNode = token.find('.rbt-token');
    expect(rootNode.hasClass('rbt-token-removeable')).to.equal(true);

    const closeButton = token.find('button');
    closeButton.simulate('click');

    expect(closeButton.hasClass('rbt-token-remove-button')).to.equal(true);
    expect(onRemove.calledOnce).to.equal(true);
  });
});
