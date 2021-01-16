import { useStateValue } from 'src/state/state';
import { setAppState } from 'src/utils/dispatchActions';
import Button from './Button';
import Heading from './styled/Heading';

/** Landing page for visitors while not logged in */

export default function HomePage() {
  const [, dispatch] = useStateValue();

  return (
    <div className="h-screen flex justify-center items-center ">
      {/** Hero image splash background */}
      <div className="px-8 max-w-4xl">
        <Heading>Sharable Grocery List App For Families</Heading>
        <div className="flex gap-4">
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
