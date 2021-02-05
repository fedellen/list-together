import KofiWidget from './styled/KofiWidget';
import PixelPajamaWidget from './styled/PixelPajamaWidget';
import SocialMediaButtons from './styled/SocialMediaButtons';

export default function Footer() {
  return (
    <div className="flex flex-wrap justify-evenly gap-8 justify-items-center items-center p-4 pb-8 text-gray-600 text-sm sm:text-base font-semibold">
      <KofiWidget />
      <SocialMediaButtons />
      <PixelPajamaWidget />
    </div>
  );
}
