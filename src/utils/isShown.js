// @flow

type Props = {
  open: boolean,
  minLength: number,
  showMenu: boolean,
  text: string,
};

export default function isShown(props: Props): boolean {
  const { open, minLength, showMenu, text } = props;

  // If menu visibility is controlled via props, that value takes precedence.
  if (open || open === false) {
    return open;
  }

  if (text.length < minLength) {
    return false;
  }

  return showMenu;
}
