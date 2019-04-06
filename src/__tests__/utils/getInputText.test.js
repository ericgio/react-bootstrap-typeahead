import getInputText from '../../utils/getInputText';
import options from '../data';

const labelKey = 'name';
const baseArgs = {
  activeItem: null,
  labelKey,
  multiple: false,
  selected: [],
  text: '',
};

describe('getInputText', () => {
  test('returns an empty string when no text is entered', () => {
    const inputText = getInputText(baseArgs);
    expect(inputText).toBe('');
  });

  test('returns the input text in multiple mode', () => {
    const text = 'Cali';
    const inputText = getInputText({
      ...baseArgs,
      multiple: true,
      text,
    });

    expect(inputText).toBe(text);
  });

  test('returns the active option label in single-select mode', () => {
    const name = 'California';
    const inputText = getInputText({
      ...baseArgs,
      activeItem: { name },
    });

    expect(inputText).toBe(name);
  });

  test('returns the active option label in multi-select mode', () => {
    const name = 'California';
    const inputText = getInputText({
      ...baseArgs,
      activeItem: { name },
      multiple: true,
    });

    expect(inputText).toBe(name);
  });

  test('returns the selected item label in single-select mode', () => {
    const selected = options.slice(0, 1);
    const inputText = getInputText({ ...baseArgs, selected });
    expect(inputText).toBe(selected[0][labelKey]);
  });

  test('does not return the selected item label in multi-select mode', () => {
    const inputText = getInputText({
      ...baseArgs,
      multiple: true,
      selected: options.slice(0, 1),
    });

    expect(inputText).toBe('');
  });
});
