import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import ClearButton from '../../src/ClearButton.react';

describe('<ClearButton>', () => {
  let button, onClick;

  beforeEach(() => {
    onClick = sinon.spy();
    button = shallow(<ClearButton onClick={onClick} />);
  });

  it('renders a default clear button', () => {
    expect(button.type()).to.equal('button');
    expect(button.hasClass('close rbt-close')).to.equal(true);
  });

  it('renders a large clear button', () => {
    button.setProps({ bsSize: 'large' });
    expect(button.hasClass('rbt-close-lg')).to.equal(true);
  });

  it('registers a click', () => {
    button.simulate('click', { stopPropagation: () => {} });
    expect(onClick.calledOnce).to.equal(true);
  });
});
