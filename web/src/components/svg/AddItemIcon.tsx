import { useStateValue } from 'src/state/state';

export default function AddItemIcon() {
  const [, dispatch] = useStateValue();
  return (
    <button
      className="w-24 rounded-full bg-dark text-lighter border-light border-4 p-1"
      onClick={() =>
        dispatch({
          type: 'TOGGLE_MODAL',
          payload: { active: true, type: 'addItem' }
        })
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
}
