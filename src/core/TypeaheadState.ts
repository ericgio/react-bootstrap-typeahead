import { TypeaheadProps, TypeaheadState } from '../types';
import { getOptionLabel } from '../utils';

type Props = TypeaheadProps;

export function getInitialState(props: Props): TypeaheadState {
  const {
    defaultInputValue,
    defaultOpen,
    defaultSelected,
    maxResults,
    multiple,
  } = props;

  let selected = props.selected
    ? props.selected.slice()
    : defaultSelected.slice();

  let text = defaultInputValue;

  if (!multiple && selected.length) {
    // Set the text if an initial selection is passed in.
    text = getOptionLabel(selected[0], props.labelKey);

    if (selected.length > 1) {
      // Limit to 1 selection in single-select mode.
      selected = selected.slice(0, 1);
    }
  }

  return {
    activeIndex: -1,
    activeItem: undefined,
    initialItem: undefined,
    isFocused: false,
    selected,
    showMenu: defaultOpen,
    shownResults: maxResults,
    text,
  };
}

export function clearTypeahead(state: TypeaheadState, props: Props) {
  return {
    ...getInitialState(props),
    isFocused: state.isFocused,
    selected: [],
    text: '',
  };
}

export function clickOrFocusInput(state: TypeaheadState) {
  return {
    ...state,
    isFocused: true,
    showMenu: true,
  };
}

export function hideMenu(state: TypeaheadState, props: Props) {
  const { activeIndex, activeItem, initialItem, shownResults } =
    getInitialState(props);

  return {
    ...state,
    activeIndex,
    activeItem,
    initialItem,
    showMenu: false,
    shownResults,
  };
}

export function toggleMenu(state: TypeaheadState, props: Props) {
  return state.showMenu ? hideMenu(state, props) : { ...state, showMenu: true };
}
