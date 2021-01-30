import { useStateValue } from 'src/state/state';
import CreateUser from './CreateUser';
import DemoList from './DemoList';
import HomePage from './HomePage';
import Login from './Login';
import UsersLists from './list/UsersLists';

/** Handles logic for displaying content based on `appState` */

export default function BodyContent() {
  const [{ appState }] = useStateValue();

  const bodyContent = () => {
    switch (appState) {
      case 'list':
        return <UsersLists />;
      case 'home':
        return <HomePage />;
      case 'login':
        return <Login />;
      case 'createUser':
        return <CreateUser />;
      case 'demo':
        return <DemoList />;
      default:
        console.error('No body content found for `appState`:', appState);
        return null;
    }
  };

  return <div className="bg-dark">{bodyContent()}</div>;
}
