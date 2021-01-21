type ArrowIconProps = {
  /** Direction of icon */
  direction: 'up' | 'right' | 'down' | 'left';
  /** Function to call when clicked */
  onClick: () => void;
  /** Tailwind classes to add */
  className?: string;
};

export default function ArrowIcon({
  direction,
  onClick,
  className
}: ArrowIconProps) {
  // Triangle icons from https://svgbox.net/iconset/octicons
  const arrowUpPath =
    'M12.354 8.854l5.792 5.792a.5.5 0 01-.353.854H6.207a.5.5 0 01-.353-.854l5.792-5.792a.5.5 0 01.708 0z';

  const arrowRightPath =
    'M15.146 12.354l-5.792 5.792a.5.5 0 01-.854-.353V6.207a.5.5 0 01.854-.353l5.792 5.792a.5.5 0 010 .708z';

  const arrowDownPath =
    'M11.646 15.146L5.854 9.354a.5.5 0 01.353-.854h11.586a.5.5 0 01.353.854l-5.793 5.792a.5.5 0 01-.707 0z';

  const arrowLeftPath =
    'M8.854 11.646l5.792-5.792a.5.5 0 01.854.353v11.586a.5.5 0 01-.854.353l-5.792-5.792a.5.5 0 010-.708z';

  let path: string;
  if (direction === 'up') path = arrowUpPath;
  else if (direction === 'down') path = arrowDownPath;
  else if (direction === 'right') {
    path = arrowRightPath;
  } else if (direction === 'left') {
    path = arrowLeftPath;
  } else return null;

  return (
    <svg
      width="50px"
      height="50px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`
      ${direction === 'left' ? '4' : '0' /* Shift icons to edge */} 
      0 
      ${direction === 'right' ? '16' : '24'} 
      24`}
      fill="currentColor"
      onClick={onClick}
      cursor="pointer"
      className={className}
    >
      <path d={path}></path>
    </svg>
  );
}
