import {expect} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';

import Loader from '../../src/Loader.react';
import {cssModulesFixture} from '../helpers';

describe('<Loader>', () => {
  let loader;

  beforeEach(() => {
    loader = shallow(<Loader />);
  });

  it('renders a default loading indicator', () => {
    expect(loader.type()).to.equal('div');
    expect(loader.hasClass('rbt-loader')).to.equal(true);
  });

  it('renders a small loading indicator', () => {
    loader.setProps({bsSize: 'small'});
    expect(loader.hasClass('rbt-loader-sm')).to.equal(true);
  });

  it('renders a large loading indicator', () => {
    loader.setProps({bsSize: 'large'});
    expect(loader.hasClass('rbt-loader-lg')).to.equal(true);
  });

  it('renders with css modules', () => {
    loader.setProps({cssModules: cssModulesFixture});
    expect(loader.hasClass('rbt-loader___AduT5')).to.equals(true);
  });
});
