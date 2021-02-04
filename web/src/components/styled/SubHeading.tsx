import { ReactNode } from 'react';

type SubHeadingProps = {
  children: ReactNode;
};

export default function SubHeading({ children }: SubHeadingProps) {
  return <h2 className="text-4xl font-semibold  font-heading">{children}</h2>;
}
