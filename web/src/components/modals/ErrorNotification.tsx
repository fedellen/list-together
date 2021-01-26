import { useStateValue } from 'src/state/state';

/** Modal for displaying global notifications */

export default function ErrorNotification() {
  const [{ errorMessage }] = useStateValue();

  /** No errors */
  if (errorMessage === '') return null;

  return (
    <div className="fixed bottom-12 left-6 p-6 text-md font-semibold w-52  bg-medium rounded-lg border-darker border-2 text-darker z-50">
      {errorMessage}
    </div>
  );
}
