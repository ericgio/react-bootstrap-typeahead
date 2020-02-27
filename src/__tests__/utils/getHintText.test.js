import getHintText from '../../utils/getHintText';
import states from '../data';

const props = {
  activeItem: null,
  initialItem: { name: 'Alabama' },
  isFocused: true,
  isMenuShown: true,
  labelKey: 'name',
  minLength: 0,
  selected: [],
  text: 'alA',
};

describe('getHintText', () => {
  test('returns a case-sensitive hint string', () => {
    const hintText = getHintText(props);
    expect(hintText).toBe('alAbama');
  });

  test('returns an empty string when the text is empty', () => {
    const hintText = getHintText({ ...props, text: '' });
    expect(hintText).toBe('');
  });

  test('returns an empty string when the menu is not focused', () => {
    const hintText = getHintText({ ...props, isFocused: false });
    expect(hintText).toBe('');
  });

  test('returns an empty string when a menu item is active', () => {
    const hintText = getHintText({ ...props, activeIndex: 0 });
    expect(hintText).toBe('');
  });

  test('returns an empty string when there is a selection', () => {
    const hintText = getHintText({ ...props, selected: [states[0]] });
    expect(hintText).toBe('');
  });

  test('returns an empty string when the menu is hidden', () => {
    const hintText = getHintText({ ...props, isMenuShown: false });
    expect(hintText).toBe('');
  });

  test(
    'returns an empty string when the initial item does not begin with the ' +
    'input string',
    () => {
      const hintText = getHintText({ ...props, text: 'Cal' });
      expect(hintText).toBe('');
    }
  );

  test(
    'returns an empty string when the initial item is a custom option',
    () => {
      const initialItem = { ...props.initialItem, customOption: true };
      const hintText = getHintText({ ...props, initialItem });
      expect(hintText).toBe('');
    }
  );

  test('handles string with composed diacritical marks', () => {
    const hintText = getHintText({
      ...props,
      initialItem: 'Schön ist, was schön lässt.',
      text: 'schon is',
    });
    expect(hintText).toBe('schon ist, was schön lässt.');
  });

  test('handles string with combined diacritical marks', () => {
    const hintText = getHintText({
      ...props,
      initialItem: 'Scho\u0308n ist, was scho\u0308n la\u0308sst.',
      text: 'schon is',
    });
    expect(hintText).toBe('schon ist, was scho\u0308n la\u0308sst.');
  });
});
