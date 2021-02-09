import { ReactNode } from 'react';

type IconButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  text: string;
  style: 'header-button' | 'side-menu-button' | 'header-option-button';
  active?: boolean;
};

export default function IconButton({
  onClick,
  icon,
  text,
  style,
  active
}: IconButtonProps) {
  return (
    <button className={`${style} ${active && 'active'}`} onClick={onClick}>
      {icon}
      <span>{text}</span>
    </button>
  );
}
