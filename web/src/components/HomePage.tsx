/** Landing page for visitors while not logged in */

import { useStateValue } from 'src/state/state';
import { AppState } from 'src/types';
import Button from './Button';

export default function HomePage() {
  const [, dispatch] = useStateValue();

  const setAppState = (state: AppState) => {
    dispatch({
      type: 'SET_APP_STATE',
      payload: state
    });
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      {/** Hero image splash background */}
      <div className="px-8 max-w-4xl">
        <div className="text-5xl font-extrabold pb-10">
          Sharable Grocery List App For Families
        </div>
        <div className="flex gap-4">
          <Button text="Login" onClick={() => setAppState('login')} />
          <Button text="New User" onClick={() => setAppState('createUser')} />
          <Button text="Try the Demo" onClick={() => setAppState('demo')} />
        </div>
      </div>
    </div>
  );
}
