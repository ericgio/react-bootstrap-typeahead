import {isPlainObject} from 'lodash';
import PropTypes from 'prop-types';

import warn from '../utils/warn';

export default function inputProps(props, propName, componentName) {
  const value = props[propName];

  PropTypes.checkPropTypes(
    {[propName]: PropTypes.object},
    props,
    'prop',
    componentName
  );

  if (!(value && isPlainObject(value))) {
    return;
  }

  // Blacklisted properties.
  [
    {alt: 'onBlur', prop: 'onBlur'},
    {alt: 'onInputChange', prop: 'onChange'},
    {alt: 'onFocus', prop: 'onFocus'},
    {prop: 'onKeyDown'},
  ].forEach(({alt, prop}) => {
    const msg = alt ? ` Use the top-level \`${alt}\` prop instead.` : null;
    warn(
      !value.hasOwnProperty(prop),
      `The \`${prop}\` property of \`inputProps\` will be ignored.${msg}`
    );
  });
}
