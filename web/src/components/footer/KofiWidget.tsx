import KofiIcon from '../svg/social/KofiIcon';

export default function KofiWidget() {
  return (
    <a href="https://ko-fi.com/pixelpajamastudios" id="kofi-widget">
      <span>
        Tip us
        <br /> a Ko-fi
      </span>
      <div id="kofi-icon">
        <KofiIcon />
      </div>
    </a>
  );
}
