import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import Loader from '../src/Loader';

describe('<Loader>', () => {

  it('renders a default loading indicator', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<Loader />);
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('div');
    expect(result.props.className).to.equal('bootstrap-typeahead-loader');
  });

  it('renders a small loading indicator', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<Loader bsSize="small" />);
    const result = renderer.getRenderOutput();

    expect(result.props.className).to.contain('loader-sm');
  });

  it('renders a large loading indicator', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<Loader bsSize="large" />);
    const result = renderer.getRenderOutput();

    expect(result.props.className).to.contain('loader-lg');
  });

});
