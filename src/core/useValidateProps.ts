import { HTMLAttributes, useEffect } from 'react';

import { TypeaheadProps } from './useTypeahead';
import { isFunction, warn } from '../utils';

interface InputPropItem {
  alt: string;
  prop: keyof HTMLAttributes<HTMLInputElement>;
}

const INPUT_PROPS_BLACKLIST: InputPropItem[] = [
  { alt: 'onBlur', prop: 'onBlur' },
  { alt: 'onInputChange', prop: 'onChange' },
  { alt: 'onFocus', prop: 'onFocus' },
  { alt: 'onKeyDown', prop: 'onKeyDown' },
];

function useValidateProps({
  allowNew,
  caseSensitive,
  defaultInputValue,
  defaultSelected = [],
  filterBy,
  highlightOnlyResult,
  id,
  ignoreDiacritics,
  inputProps,
  labelKey,
  multiple,
  onChange,
  selected,
}: TypeaheadProps) {
  useEffect(() => {
    const name = defaultSelected.length ? 'defaultSelected' : 'selected';

    warn(
      id != null,
      'The `id` prop is required to make `Menu` accessible for users of ' +
        'assistive technologies such as screen readers.'
    );

    warn(
      !(
        !multiple &&
        defaultInputValue &&
        (defaultSelected.length || (selected && selected.length))
      ),
      `\`defaultInputValue\` will be overridden by the value from \`${name}\`.`
    );

    warn(
      multiple || defaultSelected.length <= 1,
      'You are passing multiple options to the `defaultSelected` prop of a ' +
        'Typeahead in single-select mode. The selections will be truncated to a ' +
        'single selection.'
    );

    warn(
      !(highlightOnlyResult && allowNew),
      '`highlightOnlyResult` will not work with `allowNew`.'
    );

    warn(
      !caseSensitive || !isFunction(filterBy),
      'Your `filterBy` function will override the `caseSensitive` prop.'
    );

    warn(
      !ignoreDiacritics || !isFunction(filterBy),
      'Your `filterBy` function will override the `ignoreDiacritics` prop.'
    );

    if (
      !(
        inputProps &&
        Object.prototype.toString.call(inputProps) === '[object Object]'
      )
    ) {
      return;
    }

    // Blacklisted properties.
    INPUT_PROPS_BLACKLIST.forEach(({ alt, prop }) => {
      const msg = alt ? ` Use the top-level \`${alt}\` prop instead.` : null;
      warn(
        !inputProps[prop],
        `The \`${prop}\` property of \`inputProps\` will be ignored.${msg}`
      );
    });

    warn(
      !(isFunction(labelKey) && allowNew),
      '`labelKey` must be a string when using `allowNew`.'
    );

    warn(
      multiple || !selected || selected.length <= 1,
      'You are passing multiple options to the `selected` prop of a Typeahead ' +
        'in single-select mode. This may lead to unexpected behaviors or errors.'
    );

    warn(
      !selected || (selected && isFunction(onChange)),
      'You provided a `selected` prop without an `onChange` handler. If you ' +
        'want the typeahead to be uncontrolled, use `defaultSelected`. ' +
        'Otherwise, set `onChange`.'
    );
  }, [
    allowNew,
    caseSensitive,
    defaultInputValue,
    defaultSelected,
    filterBy,
    highlightOnlyResult,
    id,
    ignoreDiacritics,
    inputProps,
    labelKey,
    multiple,
    onChange,
    selected,
  ]);
}

export default useValidateProps;
