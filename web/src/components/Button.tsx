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
      className=" bg-darker px-2 py-2  border-4 border-medium border-solid text-xl font-semibold hover:bg-dark rounded-3xl"
    >
      {isLoading ? 'Loading...' : text && text}
    </button>
  );
}
