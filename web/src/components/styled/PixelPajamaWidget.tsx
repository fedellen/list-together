import PixelPajamaLogoFull from '../svg/PixelPajamaLogoFull';

export default function PixelPajamaWidget() {
  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <ul className="flex gap-6 ">
        <a className="" href="https://pixelpajamastudios.com/terms.html">
          <li>Terms</li>
        </a>
        <a href="https://pixelpajamastudios.com/privacy.html">
          <li>Privacy</li>
        </a>
        <a href="https://pixelpajamastudios.com/support.html">
          <li>Support</li>
        </a>
      </ul>
      <a href="https://pixelpajamastudios.com">
        © 2021 Pixel Pajama Studios LLC
      </a>
      <PixelPajamaLogoFull />
    </div>
  );
}
