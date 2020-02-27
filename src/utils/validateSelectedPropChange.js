// @flow

import warn from './warn';

import type { Option } from '../types';

export default function validateSelectedPropChange(
  prevSelected?: Option[],
  selected?: Option[]
): void {
  const uncontrolledToControlled = !prevSelected && selected;
  const controlledToUncontrolled = prevSelected && !selected;

  let from, to, precedent;

  if (uncontrolledToControlled) {
    from = 'uncontrolled';
    to = 'controlled';
    precedent = 'an';
  } else {
    from = 'controlled';
    to = 'uncontrolled';
    precedent = 'a';
  }

  const message =
    `You are changing ${precedent} ${from} typeahead to be ${to}. ` +
    `Input elements should not switch from ${from} to ${to} (or vice versa). ` +
    'Decide between using a controlled or uncontrolled element for the ' +
    'lifetime of the component.';

  warn(
    !(uncontrolledToControlled || controlledToUncontrolled),
    message,
  );
}
