import {expect} from 'chai';
import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';

import TypeaheadInputMulti from '../../src/TypeaheadInputMulti';

import options from '../../example/exampleData';
import {focus, getHint, getInput, getTokens} from '../helpers';

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
        onAdd={noop}
        onChange={noop}
        onFocus={noop}
        onKeyDown={noop}
        options={options}
        selected={options.slice(1, 4)}
        selectHintOnEnter={false}
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

  it('displays a hint', () => {
    const initialItem = head(options);

    wrapper.setProps({
      initialItem,
      isMenuShown: true,
      text: 'Al',
    });

    focus(wrapper);
    expect(getHint(wrapper)).to.equal(initialItem.name);
  });

});
