import PropTypes from 'prop-types';
import { Requireable } from 'react';

import { SIZES } from './constants';
import { isFunction, warn } from './utils';
import type { InputProps, TypeaheadProps } from './types';

interface InputPropItem {
  alt: string;
  prop: keyof InputProps;
}

const INPUT_PROPS_BLACKLIST: InputPropItem[] = [
  { alt: 'onBlur', prop: 'onBlur' },
  { alt: 'onInputChange', prop: 'onChange' },
  { alt: 'onFocus', prop: 'onFocus' },
  { alt: 'onKeyDown', prop: 'onKeyDown' },
];

export const sizeType = PropTypes.oneOf(SIZES);

type Props = TypeaheadProps;
type PropName = keyof Props;
type Callback = (
  props: Props,
  propName: PropName,
  componentName: string
) => void;
type Validator = Requireable<unknown>;

/**
 * Allows additional warnings or messaging related to prop validation.
 */
export function checkPropType(validator: Validator, callback: Callback) {
  return (props: Props, propName: PropName, componentName: string) => {
    PropTypes.checkPropTypes(
      { [propName]: validator },
      props,
      'prop',
      componentName
    );

    isFunction(callback) && callback(props, propName, componentName);
  };
}

export function caseSensitiveType(props: Props) {
  const { caseSensitive, filterBy } = props;
  warn(
    !caseSensitive || typeof filterBy !== 'function',
    'Your `filterBy` function will override the `caseSensitive` prop.'
  );
}

export function deprecated(validator: Validator, reason: string) {
  return (props: Props, propName: PropName, componentName: string) => {
    if (props[propName] != null) {
      warn(false, `The \`${propName}\` prop is deprecated. ${reason}`);
    }

    return PropTypes.checkPropTypes(
      { [propName]: validator },
      props,
      'prop',
      componentName
    );
  };
}

export function defaultInputValueType(props: Props) {
  const { defaultInputValue, defaultSelected = [], multiple, selected } = props;
  const name = defaultSelected.length ? 'defaultSelected' : 'selected';

  warn(
    !(
      !multiple &&
      defaultInputValue &&
      (defaultSelected.length || (selected && selected.length))
    ),
    `\`defaultInputValue\` will be overridden by the value from \`${name}\`.`
  );
}

export function defaultSelectedType(props: Props) {
  const { defaultSelected = [], multiple } = props;

  warn(
    multiple || defaultSelected.length <= 1,
    'You are passing multiple options to the `defaultSelected` prop of a ' +
      'Typeahead in single-select mode. The selections will be truncated to a ' +
      'single selection.'
  );
}

export function highlightOnlyResultType({
  allowNew,
  highlightOnlyResult,
}: Props) {
  warn(
    !(highlightOnlyResult && allowNew),
    '`highlightOnlyResult` will not work with `allowNew`.'
  );
}

export function ignoreDiacriticsType(props: Props) {
  const { filterBy, ignoreDiacritics } = props;
  warn(
    ignoreDiacritics || typeof filterBy !== 'function',
    'Your `filterBy` function will override the `ignoreDiacritics` prop.'
  );
}

export function inputPropsType({ inputProps }: Props) {
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
}

export function isRequiredForA11y(
  props: Props,
  propName: PropName,
  componentName: string
) {
  warn(
    props[propName] != null,
    `The prop \`${propName}\` is required to make \`${componentName}\` ` +
      'accessible for users of assistive technologies such as screen readers.'
  );
}

export function labelKeyType({ allowNew, labelKey }: Props) {
  warn(
    !(isFunction(labelKey) && allowNew),
    '`labelKey` must be a string when `allowNew={true}`.'
  );
}

export const optionType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.string,
]);

export function selectedType({ multiple, onChange, selected }: Props) {
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
}
