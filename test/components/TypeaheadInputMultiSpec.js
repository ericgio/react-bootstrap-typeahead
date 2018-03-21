import {expect} from 'chai';
import {mount} from 'enzyme';
import {noop} from 'lodash';
import React from 'react';

import TypeaheadInputMulti from '../../src/TypeaheadInputMulti';

import options from '../../example/exampleData';
import {getInput, getTokens} from '../helpers';

describe('<TypeaheadInputMulti>', () => {
  let text, wrapper;

  beforeEach(() => {
    text = 'text';
    wrapper = mount(
      <TypeaheadInputMulti
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        multiple
        onFocus={noop}
        onKeyDown={noop}
        options={options}
        selected={options.slice(0, 3)}
        text={text}
      />
    );
  });

  it('renders a multi-select input', () => {
    const input = wrapper.find('.form-control');

    expect(input.length).to.equal(1);
    expect(input.hasClass('rbt-input')).to.equal(true);
    expect(input.hasClass('rbt-input-multi')).to.equal(true);
  });

  it('displays the selected text', () => {
    expect(getInput(wrapper).prop('value')).to.equal(text);
  });

  it('renders a multi-select input with tokens', () => {
    expect(getTokens(wrapper).length).to.equal(3);
  });

});
