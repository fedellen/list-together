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
      className=" bg-darker px-3 py-3  border-2 border-medium border-solid text-lg leading-4 font-semibold hover:bg-dark rounded-2xl "
    >
      {isLoading ? 'Loading...' : text && text}
    </button>
  );
}
