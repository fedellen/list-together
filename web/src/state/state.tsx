import { createContext, Dispatch, useContext, useReducer } from 'react';
import { AppState, ModalState, SideMenuState } from 'src/types';
import { Action } from './reducer';

export type State = {
  /** ID for the actively displayed list */
  currentListId: string;
  /** Name of clicked item for displaying `ItemOptions` */
  activeItem: string;
  /** Contains [itemName, noteContent] when a note is clicked on */
  activeNote: [string, string];
  /** Current list displays arrows for sorting when `Move List` option is active */
  moveList: boolean;
  /** Header Options clicked on? */
  optionsOpen: boolean;
  /** Currently displayed modal */
  modalState: ModalState;
  /** List currently in `review` view or `add` view */
  sideMenuState: SideMenuState;
  /** Error notification to display in `ErrorMessage` modal */
  errorMessage: string;
  /** State for handling logged out visitors */
  appState: AppState;
};

const initialState: State = {
  currentListId: '',
  activeItem: '',
  activeNote: ['', ''],
  moveList: false,
  optionsOpen: false,
  modalState: { active: false },
  sideMenuState: 'add',
  errorMessage: '',
  appState: 'home'
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
