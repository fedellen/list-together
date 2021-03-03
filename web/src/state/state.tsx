import { createContext, Dispatch, useContext, useReducer } from 'react';
import { AppState, UndoState } from 'src/types';
import { ListState } from '../types';
import { Action } from './reducer';

export type State = {
  /** ID for current user */
  currentUserId: string;
  /** ID for the actively displayed list */
  currentListId: string;
  /** Current list displays arrows for sorting when `Move List` option is active */
  moveList: boolean;
  /** List currently in `review` view or `add` view */
  sideMenuState: 'review' | 'add';
  /** Error notification to display in `ErrorMessage` modal */
  errorMessage: string;
  /** State for handling logged out visitors */
  appState: AppState;
  /** State for handling which active list modals to show */
  listState: ListState;
  /** Contains all mutations not redone since startup, for undo functionality */
  undoState: UndoState[];
  /** Contains mutations that have been undone, to be emptied when new mutation occurs */
  redoState: UndoState[];
};

const initialState: State = {
  currentUserId: '',
  currentListId: '',
  moveList: false,
  sideMenuState: 'add',
  errorMessage: '',
  appState: 'home',
  listState: ['side'],
  undoState: [],
  redoState: []
};

export const StateContext = createContext<[State, Dispatch<Action>]>([
  initialState,
  () => initialState
]);

export const useStateValue = () => useContext(StateContext);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export default function StateProvider({
  reducer,
  children
}: StateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
}
