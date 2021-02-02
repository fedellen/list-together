import { List, UserToList } from 'src/generated/graphql';
import { Action } from 'src/state/reducer';
import {
  AppState,
  CurrentListState,
  ModalTypes,
  UserPrivileges
} from '../types';

/** Common shared dispatch actions */

export const closeModal = (dispatch: (value: Action) => void) => {
  dispatch({
    type: 'TOGGLE_MODAL',
    payload: { active: false }
  });
};

export const openModal = (
  dispatch: (value: Action) => void,
  type: ModalTypes,
  itemName?: string
) => {
  dispatch({
    type: 'TOGGLE_MODAL',
    payload: { active: true, type: type, itemName: itemName || undefined }
  });
};

export const resetActiveItem = (dispatch: (value: Action) => void) => {
  dispatch({ type: 'SET_ACTIVE_ITEM', payload: '' });
};

export const setAppState = (
  dispatch: (value: Action) => void,
  state: AppState
) => {
  closeModal(dispatch);
  dispatch({
    type: 'SET_APP_STATE',
    payload: state
  });
};

export const setNewList = (
  dispatch: (value: Action) => void,
  list: UserToList
) => {
  closeModal(dispatch);
  dispatch({
    type: 'SET_LIST',
    // Postgres only saves as `UserPrivileges` type
    payload: {
      listId: list.listId,
      privileges: list.privileges as UserPrivileges[],
      sortedItems: list.sortedItems || []
    }
  });
};

let notificationTimeoutId: ReturnType<typeof setTimeout>;
export const sendNotification = (
  dispatch: (value: Action) => void,
  messages: string[]
) => {
  for (let i = 0; i < messages.length; i++) {
    /** Clear the previous timeout */
    clearTimeout(notificationTimeoutId);
    setTimeout(() => {
      console.log(`Notification Message: "${messages}"`);
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: messages[i]
      });
      notificationTimeoutId = setTimeout(() => {
        dispatch({ type: 'END_ERROR_MESSAGE' });
        /** Close after 5 seconds */
      }, 5000);
      /** Send next notification after 4 seconds  */
    }, 4000 * i);
  }
};
