import { ReactNode } from 'react';

type IconButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  text: string;
  style:
    | 'header-button'
    | 'side-menu-button'
    | 'header-option-button'
    | 'item-option';
  active?: boolean;
  autoFocus?: boolean;
  moreStyles?: string;
};

export default function IconButton({
  onClick,
  icon,
  text,
  style,
  moreStyles,
  active,
  autoFocus = false
}: IconButtonProps) {
  return (
    <button
      autoFocus={autoFocus}
      className={`${style}${active ? ' active' : ''}${
        moreStyles ? moreStyles : ''
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
