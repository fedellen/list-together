import { List } from 'src/generated/graphql';
import { SingleItem } from './SingleItem';

type props = {
  list: List | undefined;
};

export function ItemList({ list }: props) {
  if (!list) return <div></div>;
  if (!list.items) return <div></div>;

  return (
    <div className="pl-10">
      {list.items &&
        list.items.map((i) => <SingleItem item={i} key={i.name} />)}
    </div>
  );
}
