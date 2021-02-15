import { useStateValue } from 'src/state/state';
import { setAppState } from 'src/utils/dispatchActions';
import Button from './styled/Button';

/** Landing page for visitors while not logged in */

export default function HomePage() {
  const [, dispatch] = useStateValue();

  return (
    <div className="h-screen flex justify-center items-center ">
      {/** Hero image splash background */}
      <div className="px-8 max-w-4xl">
        <h1>Sharable Grocery List App For Families</h1>
        <div className="flex gap-4 pt-8">
          <Button text="Login" onClick={() => setAppState(dispatch, 'login')} />
          <Button
            text="New User"
            onClick={() => setAppState(dispatch, 'createUser')}
          />
          <Button
            text="Try the Demo"
            onClick={() => setAppState(dispatch, 'demo')}
          />
        </div>
      </div>
    </div>
  );
}
