import {expect} from 'chai';
import mapClassNamesToCssModules from '../../src/utils/mapClassNamesToCssModules';
import {cssModulesFixture} from '../helpers';

describe('mapClassNamesToCssModules', () => {
  it('replaces class names with css module values', () => {
    const actualClassNames = mapClassNamesToCssModules(
      'dropdown-menu show',
      cssModulesFixture
    );
    const expectedClassNames = 'dropdown-menu___3kr8t show___RfU99';
    expect(actualClassNames).to.equals(expectedClassNames);
  });

  it('leaves class names unchanged for unsupported css module values', () => {
    expect(mapClassNamesToCssModules('nonexistent-class', cssModulesFixture))
      .to.equals('nonexistent-class');
  });

  it('leaves class names unchanged for undefined css modules', () => {
    expect(mapClassNamesToCssModules('dropdown-menu', undefined))
      .to.equals('dropdown-menu');
  });
});
