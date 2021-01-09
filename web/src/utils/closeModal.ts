import { Action } from 'src/state/reducer';

export const closeModal = (dispatch: (value: Action) => void) => {
  dispatch({
    type: 'TOGGLE_MODAL',
    payload: { active: false }
  });
};
