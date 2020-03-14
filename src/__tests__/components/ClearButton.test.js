import { shallow } from 'enzyme';
import React from 'react';

import ClearButton from '../../components/ClearButton.react';

describe('<ClearButton>', () => {
  let button, onClick;

  beforeEach(() => {
    onClick = jest.fn();
    button = shallow(<ClearButton onClick={onClick} />);
  });

  test('renders a default clear button', () => {
    expect(button.type()).toBe('button');
    expect(button.hasClass('close rbt-close')).toBe(true);
  });

  test('renders a large clear button', () => {
    button.setProps({ size: 'large' });
    expect(button.hasClass('rbt-close-lg')).toBe(true);
  });

  test('registers a click', () => {
    button.simulate('click', { stopPropagation: () => {} });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
