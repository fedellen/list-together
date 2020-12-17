import { Item } from 'src/generated/graphql';

type props = {
  item: Item; // Tjos will
};

export function SingleItem({ item }: props) {
  return <div className='bg-red-400'>{item.name}</div>;
}
