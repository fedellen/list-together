import { createContext, Dispatch, useContext, useReducer } from 'react';
import {
  AppState,
  ModalState,
  SideMenuState,
  CurrentListState
} from 'src/types';
import { Action } from './reducer';

export type State = {
  /** State for handling currently displayed list attributes */
  currentListState: CurrentListState;
  /** Name of item for displaying `ItemOptions` */
  activeItem: string;
  modalState: ModalState;
  sideMenuState: SideMenuState;
  /** Error notification to display in `ErrorMessage` modal */
  errorMessage: string;
  /** State for handling logged out visitors */
  appState: AppState;
};

const initialState: State = {
  currentListState: { listId: '', privileges: [], sortedItems: [] },
  activeItem: '',
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
