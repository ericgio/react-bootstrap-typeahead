import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import HintedInput from '../../src/HintedInput';
import {childContextTypes, context, getHint, getInput} from '../helpers';

describe('<HintedInput>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <HintedInput
        onChange={() => {}}
        value=""
      />,
      {childContextTypes, context}
    );
  });

  it('renders a hinted input', () => {
    expect(getInput(wrapper)).to.have.length(1);
    expect(getHint(wrapper)).to.have.length(1);
  });

  it('does not render the hint in multi-select mode', () => {
    wrapper.setProps({multiple: true});
    expect(getHint(wrapper)).to.have.length(0);
  });

});
