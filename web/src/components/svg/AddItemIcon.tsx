// import { useStateValue } from 'src/state/state';

export default function AddItemIcon() {
  // const [, dispatch] = useStateValue();
  return (
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
  );
}

{
  /* <>
<button
  className="w-12 md:w-16 rounded-full m-2  bg-indigo-300 shadow-md text-gray-700  hover:bg-indigo-400 transform transition-all hover:text-dark"
  onClick={() =>
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: true, type: 'addItem' }
    })
  }
>
<span className="block text-sm font-bold pb-2 m-0">
    Add<span className="hidden md:block">Item (A)</span>
  </span>
</button>
</> */
}
