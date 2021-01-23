import { ReactNode } from 'react';

type OptionButtonProps = {
  icon: ReactNode;
  onClick: () => void;
};

export default function OptionButton({ icon, onClick }: OptionButtonProps) {
  return (
    <button
      className="bg-darker  rounded-lg p-2 m-1 shadow-lg hover:text-light"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
