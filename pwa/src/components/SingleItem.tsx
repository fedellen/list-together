import { Item } from 'src/generated/graphql';

type props = {
  item: Item;
};

export function SingleItem({ item }: props) {
  return <div className="bg-red-400 text-2xl font-bold">{item.name}</div>;
}
