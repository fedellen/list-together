import { ReactNode } from 'react';

type SideMenuButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  text: string;
  /** Text to appear at `lg:` */
  expandedText: string;
};

export default function SideMenuButton({
  onClick,
  icon,
  text,
  expandedText
}: SideMenuButtonProps) {
  return (
    <>
      <button
        className="w-12 lg:w-16 rounded-full m-2  bg-indigo-300 shadow-md text-gray-700  hover:bg-indigo-400 transform transition-all hover:text-gray-800 hover:scale-110"
        onClick={onClick}
      >
        {icon}
        <span className="block text-sm font-bold pb-2 m-0">
          {text}
          <span className="hidden lg:block">{expandedText}</span>
        </span>
      </button>
    </>
  );
}
