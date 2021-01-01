import { useState } from 'react';
import { useGetUserQuery } from 'src/generated/graphql';
import { Menu } from './Menu';
import { Modal } from './Modal';
import { MenuIcon } from './svg/MenuIcon';

export function Header({}) {
  const [showMenu, setShowMenu] = useState(false);
  const { data } = useGetUserQuery({
    notifyOnNetworkStatusChange: true
  });
  const handleShowMenu = () => setShowMenu(!showMenu);

  return (
    <div className="h-28 p-4 bg-darker grid grid-cols-3 gap-2 justify-items-center items-center border-light border-b-4">
      <div className="text-4xl font-extrabold">Its on the List</div>
      <div className="">
        {data?.getUser ? `Hello ${data?.getUser.username}!` : 'Not logged in'}
      </div>
      <MenuIcon handleShowMenu={handleShowMenu} />
      {showMenu && (
        <Modal
          exit={handleShowMenu}
          title="Menu"
          component={<Menu handleShowMenu={handleShowMenu} />}
        />
      )}
    </div>
  );
}
