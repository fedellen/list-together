import { ReactNode } from 'react';

type HeadingProps = {
  children: ReactNode;
};

export default function Heading({ children }: HeadingProps) {
  return <h1 className="text-6xl font-extrabold">{children}</h1>;
}
