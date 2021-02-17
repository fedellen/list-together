import PixelPajamaMugLogo from '../svg/ppjs/PixelPajamaMugLogo';

export default function PixelPajamaWidget() {
  return (
    <div id="ppjs-widget">
      <div>
        <ul>
          <li className="text-link">
            <a href="https://pixelpajamastudios.com/terms.html">Terms</a>
          </li>
          <li className="text-link">
            <a href="https://pixelpajamastudios.com/privacy.html">Privacy</a>
          </li>
          <li className="text-link">
            <a href="https://pixelpajamastudios.com/support.html">Support</a>
          </li>
        </ul>
        <a className="text-link" href="https://pixelpajamastudios.com">
          © 2021 Pixel Pajama Studios LLC
        </a>
      </div>
      <a id="ppjs-mug" href="https://pixelpajamastudios.com">
        <PixelPajamaMugLogo />
      </a>
    </div>
  );
}