import {expect} from 'chai';
import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';

import TypeaheadInputMulti from '../../src/TypeaheadInputMulti.react';
import contextContainer from '../../src/containers/contextContainer';

import options from '../../example/exampleData';
import {
  context,
  cssModulesFixture,
  getHint,
  getInput,
  getTokens,
} from '../helpers';

const TypeaheadInputMultiWithContext = contextContainer(TypeaheadInputMulti);

describe('<TypeaheadInputMulti>', () => {
  let text, wrapper;

  beforeEach(() => {
    text = 'text';
    wrapper = mount(
      <TypeaheadInputMultiWithContext
        {...context}
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
      isFocused: true,
      isMenuShown: true,
      text: 'Al',
    });

    expect(getHint(wrapper)).to.equal(initialItem.name);
  });

  it('renders with validation classnames', () => {
    wrapper.setProps({
      isInvalid: true,
      isValid: true,
    });

    const input = wrapper.find('.form-control');

    expect(input.hasClass('is-invalid')).to.equal(true);
    expect(input.hasClass('is-valid')).to.equal(true);
  });

  it('renders with css modules', () => {
    wrapper.setProps({
      cssModules: cssModulesFixture,
      isInvalid: true,
      isValid: true,
    });
    const input = wrapper.find('.form-control___2KhJw');
    expect(input.hasClass('is-invalid___35wm-')).to.equals(true);
    expect(input.hasClass('is-valid___28iTl')).to.equals(true);
  });
});
