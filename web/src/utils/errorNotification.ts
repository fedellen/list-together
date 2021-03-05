import { Action } from 'src/state/reducer';
import { FieldError } from '../generated/graphql';

let timeoutId: ReturnType<typeof setTimeout>;
export const errorNotification = (
  errors: FieldError[],
  dispatch: (value: Action) => void
) => {
  const time = 5000; // 5 seconds
  clearTimeout(timeoutId); // Clear previous timer

  for (let i = 0; i < errors.length; i++) {
    setTimeout(() => {
      console.error(
        `Field Error: "${errors[i].field}", Message: "${errors[i].message}"`
      );
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: errors[i].message
      });
      timeoutId = setTimeout(() => {
        dispatch({ type: 'END_ERROR_MESSAGE' });
      }, time);
    }, 4500 * i); // Show next notifaction before 3 seconds
  }
};
