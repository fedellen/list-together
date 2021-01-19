import { Item } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { openModal } from 'src/utils/dispatchActions';

type SingleItemProps = {
  item: Item;
};

export default function SingleItem({ item }: SingleItemProps) {
  const [{ sideMenuState }, dispatch] = useStateValue();
  // const [styleItem] = useStyleItemMutation();

  const handleItemClick = (itemName: string) => {
    if (sideMenuState === 'add') {
      openModal(dispatch, 'itemOptions', itemName);
    } else if (sideMenuState === 'shop') {
      /** Use strikethrough mutation */
    } else if (sideMenuState === 'sort') {
      /** Handle dragging item */
    }
  };

  return (
    <div>
      <button
        onClick={() => handleItemClick(item.name)}
        className={`bg-red-400 text-2xl font-bold py-1 ${
          item.strike && 'line-through'
        }`}
      >
        {item.name}
      </button>
      {item.notes &&
        item.notes.map((note) => (
          <div className="pl-4 text-lg italic" key={note}>
            {note}
          </div>
        ))}
    </div>
  );
}
