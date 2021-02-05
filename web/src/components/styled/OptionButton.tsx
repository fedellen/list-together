import { ReactNode } from 'react';

type OptionButtonProps = {
  icon: ReactNode;
  onClick: () => void;
};

export default function OptionButton({ icon, onClick }: OptionButtonProps) {
  return (
    <button
      className="bg-indigo-300  rounded-lg p-2 m-1 shadow-md hover:bg-indigo-400 "
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
