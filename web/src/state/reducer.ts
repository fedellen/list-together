import { AppState, ModalState, SideMenuState } from 'src/types';
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
      payload: string;
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
      payload: [string, string];
    }
  | {
      type: 'SET_ACTIVE_NOTE';
      payload: [string, string];
    }
  | {
      type: 'TOGGLE_OPTIONS';
    }
  | {
      type: 'TOGGLE_MOVE_LISTS';
    }
  | {
      type: 'SET_USER';
      payload: string;
    }
  | {
      type: 'CLEAR_STATE';
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CLEAR_STATE':
      return {
        ...state,
        modalState: { active: false },
        activeNote: ['', ''],
        activeItem: ['', ''],
        optionsOpen: false
      };
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modalState: action.payload,
        activeNote: ['', ''],
        activeItem: ['', ''],
        optionsOpen: false
      };
    case 'SET_LIST':
      return {
        ...state,
        sideMenuState: 'add',
        activeNote: ['', ''],
        activeItem: ['', ''],
        optionsOpen: false,
        currentListId: action.payload
      };
    case 'CLEAR_LIST':
      return {
        ...state,
        currentListId: ''
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
        optionsOpen: false,
        activeNote: ['', ''],
        activeItem: action.payload
      };
    case 'SET_ACTIVE_NOTE':
      return {
        ...state,
        optionsOpen: false,
        activeItem: ['', ''],
        activeNote: action.payload
      };
    case 'TOGGLE_OPTIONS':
      return {
        ...state,
        activeItem: ['', ''],
        modalState: { active: false },
        optionsOpen: !state.optionsOpen
      };
    case 'TOGGLE_MOVE_LISTS':
      return {
        ...state,
        optionsOpen: false,
        moveList: !state.moveList
      };
    case 'SET_USER':
      return {
        ...state,
        currentUserId: action.payload,
        appState: 'list'
      };
    default:
      return state;
  }
};
