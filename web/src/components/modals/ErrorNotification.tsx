import { useStateValue } from 'src/state/state';

/** Modal for displaying global notifications */

export default function ErrorNotification() {
  const [{ errorMessage }] = useStateValue();

  return (
    <div className="fixed bottom-6 left-6 p-6 text-lg font-semibold w-72 bg-indigo-300 rounded-lg shadow-md z-50">
      {errorMessage}
    </div>
  );
}
