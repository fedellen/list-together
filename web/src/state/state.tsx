import { createContext, Dispatch, useContext, useReducer } from 'react';
// import { UserToList } from 'src/generated/graphql';
import { AppState, ModalState, SideMenuState, UserPrivileges } from 'src/types';
import { Action } from './reducer';

export type State = {
  // usersLists: UserToList[] | null;
  currentListId: string;
  privileges: UserPrivileges[] | null;
  modalState: ModalState;
  sideMenuState: SideMenuState;
  errorMessage: string;
  appState: AppState;
};

const initialState: State = {
  // usersLists: null,
  currentListId: '',
  privileges: null,
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
