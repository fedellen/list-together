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
      className="z-10 bg-indigo-300 py-3 px-6 rounded-full  shadow-md text-lg  font-semibold hover:bg-indigo-400  "
    >
      {isLoading ? 'Loading...' : text && text}
    </button>
  );
}
