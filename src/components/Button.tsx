type props = {
  text?: string;
  type?: 'submit' | 'button' | 'reset';
  onClick?(event: React.MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
};

export function Button({ text, type, onClick, isLoading }: props) {
  if (isLoading) return <div>...</div>;
  return (
    <button type={type || undefined} onClick={onClick || undefined}>
      {text && text}
    </button>
  );
}
