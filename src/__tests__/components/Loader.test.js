import { shallow } from 'enzyme';
import React from 'react';

import Loader from '../../components/Loader';

describe('<Loader>', () => {
  let loader;

  beforeEach(() => {
    loader = shallow(<Loader />);
  });

  test('renders a loading indicator', () => {
    expect(loader.type()).toBe('div');
    expect(loader.hasClass('rbt-loader spinner-border spinner-border-sm'))
      .toBe(true);
  });

  test('renders a label for accessibility', () => {
    expect(loader.find('.sr-only').text()).toBe('Loading...');

    const label = 'Waiting...';
    loader.setProps({ label });
    expect(loader.find('.sr-only').text()).toBe(label);
  });
});
