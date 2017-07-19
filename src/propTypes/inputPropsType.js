import {isPlainObject} from 'lodash';

import warn from '../utils/warn';

const BLACKLIST = [
  {alt: 'onBlur', prop: 'onBlur'},
  {alt: 'onInputChange', prop: 'onChange'},
  {alt: 'onFocus', prop: 'onFocus'},
  {alt: 'onKeyDown', prop: 'onKeyDown'},
];

export default function inputProps(props, propName, componentName) {
  const value = props[propName];
  if (!(value && isPlainObject(value))) {
    return;
  }

  // Blacklisted properties.
  BLACKLIST.forEach(({alt, prop}) => {
    const msg = alt ? ` Use the top-level \`${alt}\` prop instead.` : null;
    warn(
      !value.hasOwnProperty(prop),
      `The \`${prop}\` property of \`inputProps\` will be ignored.${msg}`
    );
  });
}
