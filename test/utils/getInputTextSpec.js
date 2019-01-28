import {expect} from 'chai';

import getInputText from '../../src/utils/getInputText';
import options from '../../example/exampleData';

const labelKey = 'name';
const baseArgs = {
  activeItem: null,
  labelKey,
  multiple: false,
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
    const inputText = getInputText({
      ...baseArgs,
      multiple: true,
      text,
    });

    expect(inputText).to.equal(text);
  });

  it('returns the active option label in single-select mode', () => {
    const name = 'California';
    const inputText = getInputText({
      ...baseArgs,
      activeItem: {name},
    });

    expect(inputText).to.equal(name);
  });

  it('returns the active option label in multi-select mode', () => {
    const name = 'California';
    const inputText = getInputText({
      ...baseArgs,
      activeItem: {name},
      multiple: true,
    });

    expect(inputText).to.equal(name);
  });

  it('returns the input text if the pagination item is active', () => {
    const args = {
      ...baseArgs,
      activeItem: {
        [labelKey]: 'More Results...',
        paginationOption: true,
      },
      text: 'foo',
    };

    expect(getInputText(args)).to.equal('foo');
  });

  it('returns the selected item label in single-select mode', () => {
    const selected = options.slice(0, 1);
    const inputText = getInputText({...baseArgs, selected});
    expect(inputText).to.equal(selected[0][labelKey]);
  });

  it('does not return the selected item label in multi-select mode', () => {
    const inputText = getInputText({
      ...baseArgs,
      multiple: true,
      selected: options.slice(0, 1),
    });

    expect(inputText).to.equal('');
  });
});
