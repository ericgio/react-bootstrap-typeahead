import { useEffect, useReducer, useRef } from 'react';

import { LabelKey, Option, TypeaheadState } from '../types';
import { getOptionLabel, isFunction } from '../utils';

interface Props {
  defaultInputValue: string;
  defaultOpen: boolean;
  defaultSelected: Option[];
  multiple: boolean;
  labelKey: LabelKey;
  selected?: Option[];
}
type State = TypeaheadState;

type NewStateObject = Partial<State>;
type NewStateCallback = (state: State, props: Props) => Partial<State>;
type PostUpdateCallback = (state: State) => void;

export function getInitialState({
  defaultInputValue,
  defaultOpen,
  defaultSelected,
  labelKey,
  multiple,
  ...props
}: Props) {
  let selected = props.selected
    ? props.selected.slice()
    : defaultSelected.slice();

  let text = defaultInputValue;

  if (!multiple && selected.length) {
    // Set the text if an initial selection is passed in.
    text = getOptionLabel(selected[0], labelKey);

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
    text,
  };
}

export function clearTypeahead(state: State, props: Props) {
  return {
    ...getInitialState(props),
    isFocused: state.isFocused,
    selected: [],
    text: '',
  };
}

export function clickOrFocusInput(state: State) {
  return {
    ...state,
    isFocused: true,
    showMenu: true,
  };
}

export function hideMenu(state: State, props: Props) {
  const { activeIndex, activeItem, initialItem } = getInitialState(props);

  return {
    ...state,
    activeIndex,
    activeItem,
    initialItem,
    showMenu: false,
  };
}

export function toggleMenu(state: State, props: Props) {
  return state.showMenu ? hideMenu(state, props) : { ...state, showMenu: true };
}

function reducer(state: State, newState: Partial<State>) {
  return {
    ...state,
    ...newState,
  };
}

export function useTypeaheadState(props: Props) {
  const initialState = getInitialState(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  const callbackQueue = useRef<PostUpdateCallback[]>([]);

  useEffect(() => {
    // Trigger any post-state-change callbacks.
    if (callbackQueue.current.length) {
      callbackQueue.current.forEach((callback) => {
        callback(state);
      });
    }
    // Reset the queue.
    callbackQueue.current = [];
  }, [state]);

  function setState(
    stateObjOrFn: NewStateObject | NewStateCallback,
    cb?: PostUpdateCallback
  ) {
    const newState = isFunction(stateObjOrFn)
      ? stateObjOrFn(state, props)
      : stateObjOrFn;

    cb && callbackQueue.current.push(cb);
    dispatch(newState);
  }

  return [state, setState] as const;
}
