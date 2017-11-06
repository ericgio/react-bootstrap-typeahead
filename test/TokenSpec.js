import {expect} from 'chai';
import {noop} from 'lodash';
import * as React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import Token from '../src/Token';

describe('<Token>', () => {
  const basicToken = <Token>Basic</Token>;

  it('renders a basic token', () => {
    const instance = ReactTestUtils.renderIntoDocument(basicToken);
    const tokenNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-token'
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
      'rbt-token-removeable'
    );
    const closeButtonNode = ReactTestUtils.findRenderedDOMComponentWithClass(
      instance,
      'rbt-token-remove-button'
    );

    expect(tokenNode).to.exist;
    expect(closeButtonNode).to.exist;
  });
});
