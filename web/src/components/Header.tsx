import { useGetUserQuery } from 'src/generated/graphql';
import MenuIcon from './svg/MenuIcon';

export default function Header({}) {
  const { data } = useGetUserQuery({
    notifyOnNetworkStatusChange: true
  });

  return (
    <div className="h-28 p-4 bg-darker grid grid-cols-3 gap-2 justify-items-center items-center border-light border-b-4">
      <div className="text-4xl font-extrabold">Its on the List</div>
      <div className="">
        {data?.getUser ? `Hello ${data?.getUser.username}!` : 'Not logged in'}
      </div>
      <MenuIcon />
    </div>
  );
}
