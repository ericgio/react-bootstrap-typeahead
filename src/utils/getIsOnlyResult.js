import {head} from 'lodash';

function getIsOnlyResult({allowNew, highlightOnlyResult, results}) {
  if (!highlightOnlyResult || allowNew) {
    return false;
  }

  return results.length === 1 && !head(results).disabled;
}

export default getIsOnlyResult;
