import {expect} from 'chai';

import getInputText from '../src/getInputText';
import states from '../example/exampleData';

let props = {
  activeIndex: -1,
  labelKey: 'name',
  options: states,
  selected: [],
  text: '',
};

describe('getInputText', () => {

  it('returns an empty string when no text is entered', () => {
    const inputText = getInputText(props);
    expect(inputText).to.equal('');
  });

  it('returns the label for the active option', () => {
    props.activeIndex = 0;
    const inputText = getInputText(props);
    expect(inputText).to.equal(states[props.activeIndex][props.labelKey]);
  });

  it('returns the label for the selected item', () => {
    props.selected = states[0];
    const inputText = getInputText(props);
    expect(inputText).to.equal(props.selected[props.labelKey]);
  });

});
