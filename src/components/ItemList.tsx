import { List } from 'src/generated/graphql';
import { SingleItem } from './SingleItem';

type props = {
  list: List | undefined;
};

export function ItemList({ list }: props) {
  if (!list) return null;
  if (!list.items) return null;

  return (
    <div className='w-11/12 align-middle'>
      {list.items &&
        list.items.map((i) => <SingleItem item={i} key={i.name} />)}
    </div>
  );
}
