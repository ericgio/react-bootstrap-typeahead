import {expect} from 'chai';

import getHintText from '../src/utils/getHintText';
import states from '../example/exampleData';

const props = {
  activeItem: null,
  initialItem: {name: 'Alabama'},
  labelKey: 'name',
  selected: [],
  text: 'alA',
};

describe('getHintText', () => {

  it('returns a case-sensitive hint string', () => {
    const hintText = getHintText(props);
    expect(hintText).to.equal('alAbama');
  });

  it('returns an empty string when the text is empty', () => {
    const hintText = getHintText({...props, text: ''});
    expect(hintText).to.equal('');
  });

  it('returns an empty string when a menu item is active', () => {
    const hintText = getHintText({...props, activeItem: props.initialItem});
    expect(hintText).to.equal('');
  });

  it('returns an empty string when there is a selection', () => {
    const hintText = getHintText({...props, selected: [states[0]]});
    expect(hintText).to.equal('');
  });

  it(
    'returns an empty string when the initial item does not begin with the ' +
    'input string',
    () => {
      const hintText = getHintText({...props, text: 'Cal'});
      expect(hintText).to.equal('');
    }
  );

  it('returns an empty string when the initial item is a custom option', () => {
    const initialItem = {...props.initialItem, customOption: true};
    const hintText = getHintText({...props, initialItem});
    expect(hintText).to.equal('');
  });

});
