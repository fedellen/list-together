import DiscordIcon from '../svg/social/DiscordIcon';
import FacebookIcon from '../svg/social/FacebookIcon';
import InstagramIcon from '../svg/social/InstagramIcon';
import TwitterIcon from '../svg/social/TwitterIcon';
import YoutubeIcon from '../svg/social/YoutubeIcon';

export default function SocialMediaButtons() {
  return (
    <div id="social-icons" className="">
      <a href="https://twitter.com/PixelPajamas">
        <TwitterIcon />
      </a>
      <a href="https://www.facebook.com/PixelPajamaStudios/">
        <FacebookIcon />
      </a>
      <a href="https://www.facebook.com/PixelPajamaStudios/">
        <DiscordIcon />
      </a>
      <a href="https://www.facebook.com/PixelPajamaStudios/">
        <InstagramIcon />
      </a>
      <a href="https://www.facebook.com/PixelPajamaStudios/">
        <YoutubeIcon />
      </a>
    </div>
  );
}
