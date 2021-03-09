import useCurrentListName from 'src/hooks/fragments/useCurrentListName';
export default function CurrentListTitle() {
  const currentListName = useCurrentListName();
  return (
    <div className="current-list-title">
      <span className="text-label">Current List Title:</span>
      <span className="list-title">{currentListName}</span>
    </div>
  );
}
