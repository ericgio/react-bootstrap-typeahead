import {expect} from 'chai';

import getOptionLabel from '../src/utils/getOptionLabel';

const label = 'California';

describe('getOptionLabel', () => {

  it('returns a string when the option is a string', () => {
    const optionLabel = getOptionLabel(label);
    expect(optionLabel).to.equal(label);
  });

  it('returns a string when the option is a plain object', () => {

    it('and the label key is a string', () => {
      const option = {label};
      const optionLabel = getOptionLabel(option, 'label');
      expect(optionLabel).to.equal(label);
    });

    it('and the label key is a function', () => {
      const option = {label};
      const labelKeyFunction = o => o.label;
      const optionLabel = getOptionLabel(option, labelKeyFunction);
      expect(optionLabel).to.equal(label);
    });
  });

  it('throws an error when the option is invalid', () => {
    const willThrow = () => getOptionLabel([], 'label');
    expect(willThrow).to.throw(Error);
  });

  it('throws an error when there is no labelKey', () => {
    const willThrow = () => getOptionLabel({label});
    expect(willThrow).to.throw(Error);
  });
});
