import { ReactNode } from 'react';

type SideMenuButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  text: string;
  /** Use header styles? */
  header?: boolean;
};

export default function SideMenuButton({
  onClick,
  icon,
  text,
  header
}: SideMenuButtonProps) {
  return (
    <button
      className={header ? 'header-button' : 'side-menu-button'}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
