import {expect} from 'chai';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import HintedInput from '../src/HintedInput';
import {getHintNode, getInputNode} from './testUtils';

const baseProps = {
  onChange: () => {},
  value: '',
};

function renderInput(props) {
  return ReactTestUtils.renderIntoDocument(<HintedInput {...props} />);
}

describe('<HintedInput>', () => {

  it('renders a hinted input', () => {
    const instance = renderInput(baseProps);

    expect(getInputNode(instance)).to.exist;
    expect(getHintNode(instance)).to.exist;
  });

  it('does not render the hint in multi-select mode', () => {
    const instance = renderInput({...baseProps, multiple: true});
    expect(getHintNode(instance)).to.not.exist;
  });

});
