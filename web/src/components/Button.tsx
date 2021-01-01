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
      className=" bg-darker px-6 py-4 my-2 border-4 border-medium border-solid text-2xl hover:bg-dark rounded-3xl"
    >
      {isLoading ? 'Loading...' : text && text}
    </button>
  );
}
