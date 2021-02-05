type ButtonProps = {
  text?: string;
  type?: 'submit' | 'button' | 'reset';
  onClick?(event: React.MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
};

export default function Button({
  text,
  type,
  onClick,
  isLoading
}: ButtonProps) {
  return (
    <button
      type={type || undefined}
      onClick={onClick || undefined}
      className=" bg-gray-200 px-3 py-1  shadow-md text-lg  font-semibold hover:bg-dark rounded-2xl "
    >
      {isLoading ? 'Loading...' : text && text}
    </button>
  );
}
