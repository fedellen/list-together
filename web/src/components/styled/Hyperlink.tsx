import { ReactNode } from 'react';

type HyperlinkProps = {
  children: ReactNode;
  link: string;
};

export default function Hyperlink({ children, link }: HyperlinkProps) {
  return (
    <a
      href={link}
      className="hover:text-ppjsOrange hover:scale-110 transform transition-all"
    >
      {children}
    </a>
  );
}
