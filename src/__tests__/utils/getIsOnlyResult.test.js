import getIsOnlyResult from '../../utils/getIsOnlyResult';

describe('getIsOnlyResult', () => {
  let props;

  beforeEach(() => {
    props = {
      allowNew: false,
      highlightOnlyResult: true,
      results: ['The only result!'],
    };
  });

  it('returns true when there is only one result', () => {
    expect(getIsOnlyResult(props)).toBe(true);
  });

  it('returns false when `highlightOnlyResult` is disabled', () => {
    props.highlightOnlyResult = false;
    expect(getIsOnlyResult(props)).toBe(false);
  });

  it('returns false when custom options are allowed', () => {
    props.allowNew = true;
    expect(getIsOnlyResult(props)).toBe(false);
  });

  it('returns false when there are more or less than one result', () => {
    props.results = ['One', 'Two'];
    expect(getIsOnlyResult(props)).toBe(false);

    props.results = [];
    expect(getIsOnlyResult(props)).toBe(false);
  });

  it('returns false when the only result is disabled', () => {
    props.results = [{ disabled: true }];
    expect(getIsOnlyResult(props)).toBe(false);
  });
});
