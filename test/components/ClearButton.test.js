import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import ClearButton from '../../src/components/ClearButton.react';

describe('<ClearButton>', () => {
  let button, onClick;

  beforeEach(() => {
    onClick = sinon.spy();
    button = shallow(<ClearButton onClick={onClick} />);
  });

  test('renders a default clear button', () => {
    expect(button.type()).toBe('button');
    expect(button.hasClass('close rbt-close')).toBe(true);
  });

  test('renders a large clear button', () => {
    button.setProps({ bsSize: 'large' });
    expect(button.hasClass('rbt-close-lg')).toBe(true);
  });

  test('registers a click', () => {
    button.simulate('click', { stopPropagation: () => {} });
    expect(onClick.calledOnce).toBe(true);
  });
});
