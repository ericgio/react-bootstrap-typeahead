import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import HintedInput from '../src/HintedInput';

describe('<HintedInput>', () => {
  let input;

  beforeEach(() => {
    input = mount(
      <HintedInput
        onChange={() => {}}
        value=""
      />
    );
  });

  it('renders a hinted input', () => {
    expect(input.find('.rbt-input-main')).to.have.length(1);
    expect(input.find('.rbt-input-hint')).to.have.length(1);
  });

  it('does not render the hint in multi-select mode', () => {
    input.setProps({multiple: true});
    expect(input.find('.rbt-input-hint')).to.have.length(0);
  });

});
