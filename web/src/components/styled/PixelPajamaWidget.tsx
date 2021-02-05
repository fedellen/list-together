import PixelPajamaMugLogo from '../svg/PixelPajamaMugLogo';
import Hyperlink from './Hyperlink';

export default function PixelPajamaWidget() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col  gap-2 justify-center items-center underline opacity-80 font-semibold">
        <ul className="flex gap-6 justify-center ">
          <Hyperlink link="https://pixelpajamastudios.com/terms.html">
            <li>Terms</li>
          </Hyperlink>
          <Hyperlink link="https://pixelpajamastudios.com/privacy.html">
            <li>Privacy</li>
          </Hyperlink>
          <Hyperlink link="https://pixelpajamastudios.com/support.html">
            <li>Support</li>
          </Hyperlink>
        </ul>
        <Hyperlink link="https://pixelpajamastudios.com">
          <div>© 2021 Pixel Pajama Studios LLC</div>
        </Hyperlink>
      </div>
      <a
        className="rounded-full w-14 sm:w-16 lg:w-24  lg:ml-4  hover:scale-110 duration-500 transform shadow-md"
        href="https://pixelpajamastudios.com"
      >
        <PixelPajamaMugLogo />
      </a>
    </div>
  );
}
