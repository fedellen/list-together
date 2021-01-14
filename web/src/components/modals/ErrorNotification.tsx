import { useStateValue } from 'src/state/state';

/** Modal for displaying global notifications */

export default function ErrorNotification() {
  const [{ errorMessage }] = useStateValue();

  /** No errors */
  if (errorMessage === '') return null;

  return (
    <div className="fixed bottom-7 left-7 p-6 text-2xl font-semibold bg-light rounded-lg border-darker border-2 text-darker z-50">
      {errorMessage}
    </div>
  );
}
