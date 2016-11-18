import {expect} from 'chai';

import getInputText from '../src/utils/getInputText';
import states from '../example/exampleData';

let props = {
  activeItem: null,
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
    props.activeItem = {name: 'Alabama'};
    const inputText = getInputText(props);
    expect(inputText).to.equal(states[0][props.labelKey]);
  });

  it('returns the label for the selected item', () => {
    props.selected = states[0];
    const inputText = getInputText(props);
    expect(inputText).to.equal(props.selected[props.labelKey]);
  });

});
