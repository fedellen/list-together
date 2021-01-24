import { Action } from 'src/state/reducer';
import { AppState, ModalTypes } from '../types';

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
  console.log('item state reset');
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
