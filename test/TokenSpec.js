import {expect} from 'chai';
import {noop} from 'lodash';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import Token from '../src/Token';

describe('<Token>', () => {
  const basicToken = <Token>Basic</Token>;

  it('renders a basic token', () => {
    const instance = ReactTestUtils.renderIntoDocument(basicToken);
    const tokenNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'token'
    );

    expect(tokenNode).to.exist;
  });

  it('renders a removeable token', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Token onRemove={noop}>
        Removeable
      </Token>
    );
    const tokenNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'token-removeable'
    );
    const closeButtonNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'close-button'
    );

    expect(tokenNode).to.exist;
    expect(closeButtonNode).to.exist;
  });
});
