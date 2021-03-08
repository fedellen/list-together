import { ReactNode } from 'react';
import FacebookIcon from '../svg/social/FacebookIcon';
import GoogleIcon from '../svg/social/GoogleIcon';
import TwitterIcon from '../svg/social/TwitterIcon';

type SignInButtonProps = {
  type: 'google' | 'twitter' | 'facebook';
};

export default function SignInButton({ type }: SignInButtonProps) {
  const authLink = `http://localhost:4000/auth/${type}`;
  // Capitalized first letter function
  const buttonText = type.replace(/^\w/, (c) => c.toUpperCase());

  let IconComponent: ReactNode;
  let color: string;
  let hoverColor: string;
  if (type === 'google') {
    color = 'red-600';
    hoverColor = 'red-700';
    IconComponent = <GoogleIcon />;
  } else if (type === 'facebook') {
    color = 'indigo-800';
    hoverColor = 'indigo-900';
    IconComponent = <FacebookIcon />;
  } /*if (type === 'twitter')*/ else {
    color = 'blue-500';
    hoverColor = 'blue-600';
    IconComponent = <TwitterIcon />;
  }

  return (
    <a
      className={`z-10  p-3  sm:px-6  flex items-center rounded-full shadow-md bg-${color} text-gray-200 text-xxs font-bold hover:bg-${hoverColor}`}
      href={authLink}
    >
      <div className="w-6 sm:mr-4">{IconComponent}</div>
      <span className="hidden sm:block">
        {buttonText}
        <br />
        Sign in
      </span>
    </a>
  );
}
