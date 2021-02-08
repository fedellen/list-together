import { ReactNode } from 'react';

type SideMenuButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  text: string;
};

export default function SideMenuButton({
  onClick,
  icon,
  text
}: SideMenuButtonProps) {
  return (
    <button className="side-menu-button" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </button>
  );
}
