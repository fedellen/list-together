import KofiIcon from '../svg/social/KofiIcon';

export default function KofiWidget() {
  return (
    <a
      href="https://ko-fi.com/pixelpajamastudios"
      className="grid items-center grid-flow-col gap-2 hover:scale-110 duration-500 transform transition-all hover:text-ppjsOrange"
    >
      <span className="leading-6 text-right hidden sm:block">
        Tip us
        <br /> a Ko-fi
      </span>
      <span className="w-12 sm:w-14 lg:w-22">
        <KofiIcon />
      </span>
    </a>
  );
}
