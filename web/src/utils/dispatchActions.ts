import { Action } from 'src/state/reducer';
import { AppState, ModalTypes } from '../types';

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
