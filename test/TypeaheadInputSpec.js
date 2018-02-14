import {expect} from 'chai';
import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';

import TypeaheadInput from '../src/TypeaheadInput';

import options from '../example/exampleData';
import {getHint, getInput} from './testUtils';
import {RETURN, RIGHT, TAB} from '../src/constants/keyCode';

function getRoot(wrapper) {
  return wrapper.find('.rbt-input');
}

function setCursorPosition(wrapper, pos) {
  const input = getInput(wrapper);
  input.instance().selectionStart = pos;
  input.simulate('change');
}

function simulateKeyDown(wrapper, value) {
  const input = getInput(wrapper);
  input.simulate('focus');
  input.simulate('keyDown', {
    keyCode: value,
    which: value,
  });
}

describe('<TypeaheadInput>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TypeaheadInput
        inputProps={{}}
        isFocused={true}
        labelKey="name"
        onFocus={noop}
        options={options}
        selected={[]}
        text=""
      />
    );
  });

  it('renders a TypeaheadInput', () => {
    const rootNode = getRoot(wrapper);
    expect(rootNode.length).to.equal(1);
    expect(rootNode.hasClass('form-control')).to.equal(true);
  });

  it('displays the selected text', () => {
    const text = 'text';

    wrapper.setProps({text});

    expect(getInput(wrapper).props().value).to.equal(text);
  });

  it('displays a hint', () => {
    const initialItem = head(options);

    wrapper.setProps({
      initialItem,
      isMenuShown: true,
      text: 'Al',
    });

    getInput(wrapper).simulate('focus');
    expect(getHint(wrapper).props().value).to.equal(initialItem.name);
  });

  describe('behavior when selecting the hinted result', () => {
    let keyCode, selected;

    beforeEach(() => {
      keyCode = 0;
      selected = [];

      wrapper.setProps({
        initialItem: head(options),
        isMenuShown: true,
        onAdd: (selectedItem) => selected = [selectedItem],
        onChange: noop,
        onKeyDown: (e) => keyCode = e.keyCode,
        selected,
        text: 'Ala',
      });
    });

    it('should select the hinted result on tab keydown', () => {
      simulateKeyDown(wrapper, TAB);

      expect(keyCode).to.equal(TAB);
      expect(selected.length).to.equal(1);
    });

    it('should select the hinted result on right arrow keydown', () => {
      setCursorPosition(wrapper, wrapper.props().text.length);
      simulateKeyDown(wrapper, RIGHT);

      expect(keyCode).to.equal(RIGHT);
      expect(selected.length).to.equal(1);
    });

    it(
      'should not select the hinted result on right arrow keydown unless ' +
      'the cursor is at the end of the input value',
      () => {
        setCursorPosition(wrapper, 1);
        simulateKeyDown(wrapper, RIGHT);

        expect(keyCode).to.equal(RIGHT);
        expect(selected.length).to.equal(0);
      }
    );

    it('should not select the hinted result on enter keydown', () => {
      simulateKeyDown(wrapper, RETURN);

      expect(keyCode).to.equal(RETURN);
      expect(selected.length).to.equal(0);
    });

    it('should select the hinted result on enter keydown', () => {
      wrapper.setProps({selectHintOnEnter: true});
      simulateKeyDown(wrapper, RETURN);

      expect(keyCode).to.equal(RETURN);
      expect(selected.length).to.equal(1);
    });
  });

  describe('multi-select state', () => {
    beforeEach(() => {
      wrapper.setProps({multiple: true});
    });

    it('renders a multi-select input', () => {
      expect(wrapper.find('.rbt-input-multi').length).to.equal(1);
    });

    it('renders tokens in the input', () => {
      wrapper.setProps({selected: options.slice(0, 3)});
      expect(wrapper.find('.rbt-token').length).to.equal(3);
    });
  });

});
