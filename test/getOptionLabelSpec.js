import {expect} from 'chai';

import getOptionLabel from '../src/utils/getOptionLabel';

describe('getOptionLabel', () => {
  let label, option;

  beforeEach(() => {
    label = 'California';
    option = {label};
  });

  describe('returns a string when', () => {

    it('receives an `option` string', () => {
      const optionLabel = getOptionLabel(label);
      expect(optionLabel).to.equal(label);
    });

    it('receives a `labelKey` function', () => {
      const labelKeyFunction = o => o.label;
      const optionLabel = getOptionLabel(option, labelKeyFunction);
      expect(optionLabel).to.equal(label);
    });

    it('receives a `labelKey` string', () => {
      const optionLabel = getOptionLabel(option, 'label');
      expect(optionLabel).to.equal(label);
    });
  });

  it('gives precedence to `labelKey` when it is a function', () => {
    const customLabel = 'Custom Label';
    const optionLabel = getOptionLabel(label, () => customLabel);
    expect(optionLabel).to.equal(customLabel);
  });

  describe('throws an error when', () => {
    it('has an invalid option', () => {
      const willThrow = () => getOptionLabel([], 'label');
      expect(willThrow).to.throw(Error);
    });

    it('has no labelKey and the option is an object', () => {
      const willThrow = () => getOptionLabel(option);
      expect(willThrow).to.throw(Error);
    });
  });
});
