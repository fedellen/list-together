import KofiIcon from '../svg/social/KofiIcon';

export default function KofiWidget() {
  return (
    <a
      href="https://ko-fi.com/pixelpajamastudios"
      className="grid items-center grid-flow-col gap-2 hover:scale-125 duration-500 transform transition-all"
    >
      <span className="text-lg font-bold text-light leading-6 text-right">
        Tip us
        <br /> a Ko-fi
      </span>
      <span className="w-12">
        <KofiIcon />
      </span>
    </a>
  );
}
