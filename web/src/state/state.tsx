import { createContext, Dispatch, useContext, useReducer } from 'react';
// import { UserToList } from 'src/generated/graphql';
import { AppState, ModalState, SideMenuState, UserPrivileges } from 'src/types';
import { Action } from './reducer';

export type State = {
  currentListId: string;
  privileges: UserPrivileges[] | null;
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
  currentListId: '',
  privileges: null,
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
