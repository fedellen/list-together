import { ReactNode } from 'react';
import FacebookIcon from '../svg/social/FacebookIcon';
import GoogleIcon from '../svg/social/GoogleIcon';
import TwitterIcon from '../svg/social/TwitterIcon';

type SignInButtonProps = {
  type: 'google' | 'twitter' | 'facebook';
};

export default function SignInButton({ type }: SignInButtonProps) {
  const authLink = `${
    process.env.NODE_ENV === 'production'
      ? 'https://api.listtogether.app' // prod
      : 'http://localhost:4000' // dev
  }/auth/${type}`;

  // Capitalized first letter function
  const buttonText = type.replace(/^\w/, (c) => c.toUpperCase());

  let IconComponent: ReactNode;
  if (type === 'google') {
    IconComponent = <GoogleIcon />;
  } else if (type === 'facebook') {
    IconComponent = <FacebookIcon />;
  } /*if (type === 'twitter')*/ else {
    IconComponent = <TwitterIcon />;
  }

  return (
    <a className={`sign-in-button ${type}`} href={authLink}>
      <div>{IconComponent}</div>
      <span>
        {buttonText}
        <br />
        Sign in
      </span>
    </a>
  );
}
