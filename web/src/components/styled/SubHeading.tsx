import { ReactNode } from 'react';

type SubHeadingProps = {
  children: ReactNode;
};

export default function SubHeading({ children }: SubHeadingProps) {
  return <h2 className="text-4xl font-bold">{children}</h2>;
}
