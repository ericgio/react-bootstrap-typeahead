import {expect} from 'chai';

import getHintText from '../src/getHintText';
import states from '../example/exampleData';

let isFocused = true;
let props = {
  activeIndex: -1,
  labelKey: 'name',
  options: states,
  selected: [],
  text: 'alA',
};

describe('getHintText', () => {

  it('returns a case-sensitive hint string', () => {
    const hintText = getHintText(props, isFocused);
    expect(hintText).to.equal('alAbama');
  });

  it('returns an empty string when the input is blurred', () => {
    isFocused = false;
    const hintText = getHintText(props, isFocused);
    expect(hintText).to.equal('');
  });

  it('returns an empty string when the text is empty', () => {
    props.text = '';
    const hintText = getHintText(props, isFocused);
    expect(hintText).to.equal('');
  });

  it('returns an empty string when a menu item is active', () => {
    props.activeIndex = 0;
    const hintText = getHintText(props, isFocused);
    expect(hintText).to.equal('');
  });

  it('returns an empty string when there is a selection', () => {
    props.selected = [states[0]];
    const hintText = getHintText(props, isFocused);
    expect(hintText).to.equal('');
  });

  it(
    'returns an empty string when the first menu option does not begin with ' +
    'the input string',
    () => {
      props.text = 'Cal';
      const hintText = getHintText(props, isFocused);
      expect(hintText).to.equal('');
    }
  );

});
