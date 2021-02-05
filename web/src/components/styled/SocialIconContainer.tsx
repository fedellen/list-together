import { ReactNode } from 'react';

type SocialIconContainerProps = {
  /** SVG Icon to put display */
  icon: ReactNode;
  /** <a href="{link}"> */
  link: string;
};

export default function SocialIconContainer({
  icon,
  link
}: SocialIconContainerProps) {
  return (
    <a
      href={link}
      className="w-9 sm:w-10 transform hover:scale-125 transition-all duration-500 hover:text-ppjsOrange"
    >
      {icon}
    </a>
  );
}
