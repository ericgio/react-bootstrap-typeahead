interface Props {
  open?: boolean;
  minLength: number;
  showMenu: boolean;
  text: string;
}

export default function isShown({
  open,
  minLength,
  showMenu,
  text,
}: Props): boolean {
  // If menu visibility is controlled via props, that value takes precedence.
  if (open || open === false) {
    return open;
  }

  if (text.length < minLength) {
    return false;
  }

  return showMenu;
}
