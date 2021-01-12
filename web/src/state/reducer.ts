// import { UserToList } from 'src/generated/graphql';
import { ModalState, SideMenuState, UserPrivileges } from 'src/types';
import { State } from './state';

export type Action =
  | {
      type: 'TOGGLE_MODAL';
      payload: ModalState;
    }
  | {
      type: 'SET_LIST';
      payload: { listId: string; privileges: UserPrivileges[] };
    }
  | {
      type: 'SET_SIDE_MENU_STATE';
      payload: SideMenuState;
    }
  | {
      type: 'SET_ERROR_MESSAGE';
      payload: string;
    }
  | {
      type: 'END_ERROR_MESSAGE';
    };
// | {
//     type: 'SET_USERS_LISTS';
//     payload: UserToList[];
//   };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modalState: action.payload
      };
    case 'SET_LIST':
      return {
        ...state,
        currentListId: action.payload.listId,
        privileges: action.payload.privileges
      };
    case 'SET_SIDE_MENU_STATE':
      return {
        ...state,
        sideMenuState: action.payload
      };
    case 'SET_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload
      };
    case 'END_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: ''
      };
    // case 'SET_USERS_LISTS':
    //   return {
    //     ...state,
    //     usersLists: action.payload
    //   };
    default:
      return state;
  }
};