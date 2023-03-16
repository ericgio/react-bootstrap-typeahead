import getOptionProperty from './getOptionProperty';

import { AllowNew, OptionType } from '../types';

interface Props<Option extends OptionType> {
  allowNew: AllowNew<Option>;
  highlightOnlyResult: boolean;
  results: Option[];
}

function getIsOnlyResult<Option extends OptionType>(props: Props<Option>): boolean {
  const { allowNew, highlightOnlyResult, results } = props;

  if (!highlightOnlyResult || allowNew) {
    return false;
  }

  return results.length === 1 && !getOptionProperty(results[0], 'disabled');
}

export default getIsOnlyResult;
