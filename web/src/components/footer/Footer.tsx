import { memo } from 'react';
import KofiWidget from './KofiWidget';
import PixelPajamaWidget from './PixelPajamaWidget';
import SocialMediaButtons from './SocialMediaButtons';

const Footer = memo(function Footer() {
  return (
    <section id="footer">
      <KofiWidget />
      <SocialMediaButtons />
      <PixelPajamaWidget />
    </section>
  );
});
export default Footer;
