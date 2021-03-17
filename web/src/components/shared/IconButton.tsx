import { ReactNode } from 'react';

type IconButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  text: string;
  ariaLabel: string;
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
  ariaLabel,
  autoFocus = false
}: IconButtonProps) {
  return (
    <button
      autoFocus={autoFocus}
      className={`${style}${active ? ' active' : ''}${
        moreStyles ? moreStyles : ''
      }`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
