import { shallow } from 'enzyme';
import React from 'react';

import ClearButton from '../../components/ClearButton';

import { BACKSPACE, RETURN } from '../../constants';

describe('<ClearButton>', () => {
  let button, onClick;

  beforeEach(() => {
    onClick = jest.fn();
    button = shallow(<ClearButton onClick={onClick} />);
  });

  it('renders a default clear button', () => {
    expect(button.type()).toBe('button');
    expect(button.hasClass('close rbt-close')).toBe(true);
  });

  it('renders a large clear button', () => {
    button.setProps({ size: 'large' });
    expect(button.hasClass('rbt-close-lg')).toBe(true);
  });

  it('registers a click', () => {
    const e = { stopPropagation: jest.fn() };
    button.simulate('click', e);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(e.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('prevents the default backspace behavior', () => {
    const onKeyDown = jest.fn();
    button.setProps({ onKeyDown });

    const backspace = {
      keyCode: BACKSPACE,
      preventDefault: jest.fn(),
    };
    button.simulate('keydown', backspace);

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(backspace.preventDefault).toHaveBeenCalledTimes(1);

    const enter = {
      keyCode: RETURN,
      preventDefault: jest.fn(),
    };
    button.simulate('keydown', enter);

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(enter.preventDefault).toHaveBeenCalledTimes(0);
  });
});
