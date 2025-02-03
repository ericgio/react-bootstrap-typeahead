import { useEffect, useState } from 'react';

import { LabelKey, Option, SelectEvent } from '../../types';
import { getStringLabelKey, getTruncatedOptions } from '../../utils';

interface UsePagination {
  isMenuShown: boolean;
  labelKey: LabelKey;
  maxResults: number;
  onPaginate?: (e: SelectEvent<HTMLElement>, shownResults: number) => void;
  paginate: boolean;
  results: Option[];
  text: string;
}

function usePagination({
  isMenuShown,
  labelKey,
  maxResults,
  paginate,
  text,
  ...props
}: UsePagination) {
  let results = [...props.results];
  const [shownResults, setShownResults] = useState(maxResults);

  // Reset shown results when the menu closes or the input text changes
  useEffect(() => {
    setShownResults(maxResults);
  }, [isMenuShown, maxResults, text]);

  function onPaginate(e: SelectEvent<HTMLElement>) {
    setShownResults((prevShownResults) => {
      const newShownResults = prevShownResults + maxResults;
      props.onPaginate?.(e, newShownResults);
      return newShownResults;
    });
  }

  // This must come before results are truncated.
  const shouldPaginate = paginate && results.length > shownResults;
  results = getTruncatedOptions(results, shownResults);

  // Add the pagination item if necessary.
  if (shouldPaginate) {
    results.push({
      [getStringLabelKey(labelKey)]: '',
      paginationOption: true,
    });
  }

  return { onPaginate, results };
}

export default usePagination;
