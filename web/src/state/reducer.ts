import {
  AppState,
  CurrentListState,
  ModalState,
  SideMenuState
} from 'src/types';
import { State } from './state';

export type Action =
  | {
      type: 'SET_APP_STATE';
      payload: AppState;
    }
  | {
      type: 'TOGGLE_MODAL';
      payload: ModalState;
    }
  | {
      type: 'SET_LIST';
      payload: CurrentListState;
    }
  | {
      type: 'CLEAR_LIST';
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
    }
  | {
      type: 'SET_ACTIVE_ITEM';
      payload: string;
    };

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
        currentListState: action.payload
      };
    case 'CLEAR_LIST':
      return {
        ...state,
        currentListState: { listId: '', privileges: [], sortedItems: [] }
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
    case 'SET_APP_STATE':
      return {
        ...state,
        appState: action.payload
      };
    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.payload
      };
    default:
      return state;
  }
};
