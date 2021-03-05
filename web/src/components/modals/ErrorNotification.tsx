import { useStateValue } from 'src/state/state';

/** Modal for displaying global notifications */

export default function ErrorNotification() {
  const [{ errorMessage }] = useStateValue();

  return <div id="notification">{errorMessage}</div>;
}
