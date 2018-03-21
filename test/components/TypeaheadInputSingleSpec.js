import {expect} from 'chai';
import {mount} from 'enzyme';
import {head, noop} from 'lodash';
import React from 'react';

import TypeaheadInputSingle from '../../src/TypeaheadInputSingle';

import options from '../../example/exampleData';
import {getHint, getInput, keyDown} from '../helpers';
import {RETURN, RIGHT, TAB} from '../../src/constants/keyCode';

function setCursorPosition(wrapper, pos) {
  const input = getInput(wrapper);
  input.instance().selectionStart = pos;
  input.simulate('change');
}

describe('<TypeaheadInputSingle>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TypeaheadInputSingle
        inputProps={{}}
        inputRef={noop}
        labelKey="name"
        onClear={noop}
        onFocus={noop}
        options={options}
        selected={[]}
        text=""
      />
    );
  });

  it('renders a single-select input', () => {
    const input = wrapper.find('.form-control');

    expect(input.length).to.equal(1);
    expect(input.hasClass('rbt-input')).to.equal(true);
    expect(input.hasClass('rbt-input-main')).to.equal(true);
  });

  it('displays the selected text', () => {
    const text = 'text';

    wrapper.setProps({text});

    expect(getInput(wrapper).prop('value')).to.equal(text);
  });

  it('displays a hint', () => {
    const initialItem = head(options);

    wrapper.setProps({
      initialItem,
      isMenuShown: true,
      text: 'Al',
    });

    getInput(wrapper).simulate('focus');
    expect(getHint(wrapper).text()).to.equal(initialItem.name);
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
      keyDown(wrapper, TAB);

      expect(keyCode).to.equal(TAB);
      expect(selected.length).to.equal(1);
    });

    it('should select the hinted result on right arrow keydown', () => {
      setCursorPosition(wrapper, wrapper.prop('text').length);
      keyDown(wrapper, RIGHT);

      expect(keyCode).to.equal(RIGHT);
      expect(selected.length).to.equal(1);
    });

    it(
      'should not select the hinted result on right arrow keydown unless ' +
      'the cursor is at the end of the input value',
      () => {
        setCursorPosition(wrapper, 1);
        keyDown(wrapper, RIGHT);

        expect(keyCode).to.equal(RIGHT);
        expect(selected.length).to.equal(0);
      }
    );

    it('should not select the hinted result on enter keydown', () => {
      keyDown(wrapper, RETURN);

      expect(keyCode).to.equal(RETURN);
      expect(selected.length).to.equal(0);
    });

    it('should select the hinted result on enter keydown', () => {
      wrapper.setProps({selectHintOnEnter: true});
      keyDown(wrapper, RETURN);

      expect(keyCode).to.equal(RETURN);
      expect(selected.length).to.equal(1);
    });
  });

});
