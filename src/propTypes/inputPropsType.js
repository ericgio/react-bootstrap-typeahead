import { isPlainObject } from 'lodash';

import warn from '../utils/warn';

const BLACKLIST = [
  { alt: 'onBlur', prop: 'onBlur' },
  { alt: 'onInputChange', prop: 'onChange' },
  { alt: 'onFocus', prop: 'onFocus' },
  { alt: 'onKeyDown', prop: 'onKeyDown' },
];

export default function inputPropsType(props, propName, componentName) {
  const { inputProps } = props;
  if (!(inputProps && isPlainObject(inputProps))) {
    return;
  }

  // Blacklisted properties.
  BLACKLIST.forEach(({ alt, prop }) => {
    const msg = alt ? ` Use the top-level \`${alt}\` prop instead.` : null;
    warn(
      !inputProps[prop],
      `The \`${prop}\` property of \`inputProps\` will be ignored.${msg}`
    );
  });
}
