import { HTMLAttributes } from 'react';
import { Id } from '../types';

interface Args {
  id?: Id;
}

type UserMenuProps = HTMLAttributes<HTMLElement>;

function getMenuProps(props: Args) {
  return ({
    'aria-label': ariaLabel = 'menu-options',
    ...userMenuProps
  }: UserMenuProps = {}) => ({
    ...userMenuProps,
    'aria-label': ariaLabel,
    id: props.id,
    role: 'listbox',
  });
}

export default getMenuProps;
