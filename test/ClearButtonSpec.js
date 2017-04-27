import {expect} from 'chai';
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import ClearButton from '../src/ClearButton';

describe('<ClearButton>', () => {

  it('renders a default clear button', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<ClearButton />);
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('button');
    expect(result.props.className).to.equal('close');
  });

  it('renders a large clear button', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<ClearButton bsSize="large" />);
    const result = renderer.getRenderOutput();

    expect(result.props.className).to.contain('close-lg');
  });

});
