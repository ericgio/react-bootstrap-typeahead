import {expect} from 'chai';

import getInputText from '../../src/utils/getInputText';
import states from '../../example/exampleData';

const labelKey = 'name';
const baseArgs = {
  activeItem: null,
  labelKey,
  options: states,
  selected: [],
  text: '',
};

describe('getInputText', () => {

  it('returns an empty string when no text is entered', () => {
    const inputText = getInputText(baseArgs);
    expect(inputText).to.equal('');
  });

  it('returns the input text in multiple mode', () => {
    const text = 'Cali';
    const args = {
      ...baseArgs,
      multiple: true,
      text,
    };
    const inputText = getInputText(args);
    expect(inputText).to.equal(text);
  });

  it('returns the label for the active option', () => {
    const args = {
      ...baseArgs,
      activeItem: {name: 'Alabama'},
    };
    const inputText = getInputText(args);
    expect(inputText).to.equal(states[0][labelKey]);
  });

  it('returns an empty string if the pagination item is active', () => {
    const activeItem = {
      [labelKey]: 'More Results...',
      paginationOption: true,
    };

    expect(getInputText({...baseArgs, activeItem})).to.equal('');
  });

  it('returns the label for the selected item', () => {
    const selected = states.slice(0, 1);
    const inputText = getInputText({...baseArgs, selected});
    expect(inputText).to.equal(selected[0][labelKey]);
  });

});
