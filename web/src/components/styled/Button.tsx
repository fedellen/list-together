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
      className="button"
    >
      {isLoading ? 'Loading...' : text && text}
    </button>
  );
}
