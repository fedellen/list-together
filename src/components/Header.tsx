type HeaderProps = {
  user: string;
};

export function Header({ user }: HeaderProps) {
  return (
    <div className="h-28 bg-darker">
      <div className="grid-cols-3 gap-4">
        <div className="">{user ? `Hello ${user}!` : 'Not logged in'}</div>
      </div>
    </div>
  );
}
