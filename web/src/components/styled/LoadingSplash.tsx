import LoadingIcon from '../svg/LoadingIcon';

export default function LoadingSplash() {
  return (
    <div className="w-36 mx-auto mt-10 mb-4 border-b-4 pb-8  border-indigo-700 flex flex-col gap-4 items-center">
      <LoadingIcon />
      <span className="text-lg font-bold italic">Loading..</span>
    </div>
  );
}
