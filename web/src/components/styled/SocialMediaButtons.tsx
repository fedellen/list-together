import DiscordIcon from '../svg/social/DiscordIcon';
import FacebookIcon from '../svg/social/FacebookIcon';
import InstagramIcon from '../svg/social/InstagramIcon';
import TwitterIcon from '../svg/social/TwitterIcon';
import YoutubeIcon from '../svg/social/YoutubeIcon';
import SocialIconContainer from './SocialIconContainer';

export default function SocialMediaButtons() {
  return (
    <div className="flex gap-2 ">
      <SocialIconContainer
        link="https://twitter.com/PixelPajamas"
        icon={<TwitterIcon />}
      />
      <SocialIconContainer
        link="https://www.facebook.com/PixelPajamaStudios/"
        icon={<FacebookIcon />}
      />
      <SocialIconContainer
        link="https://www.facebook.com/PixelPajamaStudios/"
        icon={<DiscordIcon />}
      />
      <SocialIconContainer
        link="https://www.facebook.com/PixelPajamaStudios/"
        icon={<InstagramIcon />}
      />
      <SocialIconContainer
        link="https://www.facebook.com/PixelPajamaStudios/"
        icon={<YoutubeIcon />}
      />
    </div>
  );
}
