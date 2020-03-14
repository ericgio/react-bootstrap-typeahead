import PropTypes from 'prop-types';

import { isFunction, values, warn } from './utils';
import { SIZE } from './constants';

const INPUT_PROPS_BLACKLIST = [
  { alt: 'onBlur', prop: 'onBlur' },
  { alt: 'onInputChange', prop: 'onChange' },
  { alt: 'onFocus', prop: 'onFocus' },
  { alt: 'onKeyDown', prop: 'onKeyDown' },
];

export const sizeType = PropTypes.oneOf(values(SIZE));

/**
 * Allows additional warnings or messaging related to prop validation.
 */
export function checkPropType(validator, callback) {
  return (props, propName, componentName) => {
    PropTypes.checkPropTypes(
      { [propName]: validator },
      props,
      'prop',
      componentName
    );

    isFunction(callback) && callback(props, propName, componentName);
  };
}

export function caseSensitiveType(props, propName, componentName) {
  const { caseSensitive, filterBy } = props;
  warn(
    !caseSensitive || typeof filterBy !== 'function',
    'Your `filterBy` function will override the `caseSensitive` prop.'
  );
}

export function deprecated(validator, reason) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      warn(
        false,
        `The prop \`${propName}\` is deprecated. ${reason}`
      );
    }

    return PropTypes.checkPropTypes(
      { [propName]: validator },
      props,
      'prop',
      componentName
    );
  };
}

export function defaultInputValueType(props, propName, componentName) {
  const { defaultInputValue, defaultSelected, multiple, selected } = props;
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

export function highlightOnlyResultType(
  props,
  propName,
  componentName
) {
  const { allowNew, highlightOnlyResult } = props;
  warn(
    !(highlightOnlyResult && allowNew),
    '`highlightOnlyResult` will not work with `allowNew`.'
  );
}

export function ignoreDiacriticsType(props, propName, componentName) {
  const { filterBy, ignoreDiacritics } = props;
  warn(
    ignoreDiacritics || typeof filterBy !== 'function',
    'Your `filterBy` function will override the `ignoreDiacritics` prop.'
  );
}

export function inputPropsType(props, propName, componentName) {
  const { inputProps } = props;
  if (!(
    inputProps &&
    Object.prototype.toString.call(inputProps) === '[object Object]'
  )) {
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

export function isRequiredForA11y(props, propName, componentName) {
  warn(
    props[propName] != null,
    `The prop \`${propName}\` is required to make \`${componentName}\` ` +
    'accessible for users of assistive technologies such as screen readers.'
  );
}

export function labelKeyType(props, propName, componentName) {
  const { allowNew, labelKey } = props;
  warn(
    !(isFunction(labelKey) && allowNew),
    '`labelKey` must be a string when `allowNew={true}`.'
  );
}

export const optionType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.string,
]);

export function selectedType(props, propName, componentName) {
  const { onChange, selected } = props;
  warn(
    !selected || (selected && isFunction(onChange)),
    'You provided a `selected` prop without an `onChange` handler. If you ' +
    'want the typeahead to be uncontrolled, use `defaultSelected`. ' +
    'Otherwise, set `onChange`.'
  );
}
