import {
  AppState,
  ItemState,
  ModalState,
  NoteState,
  UndoState
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
      payload: string;
    }
  | {
      type: 'CLEAR_LIST';
    }
  | {
      type: 'SET_SIDE_MENU_STATE';
      payload: 'add' | 'review';
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
      payload: ItemState;
    }
  | {
      type: 'SET_ACTIVE_NOTE';
      payload: NoteState;
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
    }
  | {
      type: 'ADD_TO_UNDO';
      payload: UndoState;
    }
  | {
      type: 'UNDO_MUTATION';
    }
  | {
      type: 'REMOVE_UNDO';
    }
  | {
      type: 'REMOVE_REDO';
    }
  | {
      type: 'REDO_MUTATION';
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CLEAR_STATE':
      return {
        ...state,
        listState: ['side']
      };
    case 'TOGGLE_MODAL':
      return {
        ...state,
        listState: ['modal', action.payload]
      };
    case 'SET_LIST':
      return {
        ...state,
        sideMenuState: 'add',
        listState: ['side'],
        currentListId: action.payload
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
        listState: ['item', action.payload]
      };
    case 'SET_ACTIVE_NOTE':
      return {
        ...state,
        listState: ['note', action.payload]
      };
    case 'TOGGLE_OPTIONS':
      return {
        ...state,
        listState: ['options']
      };
    case 'TOGGLE_MOVE_LISTS':
      return {
        ...state,
        listState: ['side'],
        moveList: !state.moveList
      };
    case 'SET_USER':
      return {
        ...state,
        currentUserId: action.payload,
        appState: 'list'
      };
    case 'ADD_TO_UNDO':
      return {
        ...state,
        undoState: [...state.undoState, action.payload]
      };
    case 'REMOVE_UNDO':
      return {
        ...state,
        undoState: state.undoState.filter((_, index) => index > 0)
      };
    case 'REMOVE_REDO':
      return {
        ...state,
        redoState: state.redoState.filter((_, index) => index > 0)
      };
    case 'UNDO_MUTATION':
      return {
        ...state,
        /** Add last undo to redo state */
        redoState: [
          ...state.redoState,
          state.undoState[state.undoState.length - 1]
        ],
        /** Filter last index off of undo array */
        undoState: state.undoState.filter(
          (_, index) => index < state.undoState.length - 1
        )
      };
    case 'REDO_MUTATION':
      return {
        ...state,
        /** Add last redo to undo state */
        undoState: [
          ...state.undoState,
          state.redoState[state.redoState.length - 1]
        ],
        /** Filter last index off of redoState array */
        redoState: state.redoState.filter(
          (_, index) => index < state.redoState.length - 1
        )
      };

    default:
      return state;
  }
};
