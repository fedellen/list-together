import { useState } from 'react';
import { useAddItemMutation } from '../generated/graphql';
import { SideMenuState } from '../types';
import { Modal } from './Modal';
import { SingleInput } from './SingleInput';
import { AddItemIcon } from './svg/AddItemIcon';

type SideMenuProps = {
  sideMenuState: SideMenuState;
  setSideMenuState: (arg: SideMenuState) => void;
  currentListId: string;
};

export default function SideMenu({
  sideMenuState: state,
  setSideMenuState: setState,
  currentListId
}: SideMenuProps) {
  const [addItem, { loading }] = useAddItemMutation();
  const [toggleAddItem, setToggleAddItem] = useState(false);

  const handleAddItem = async (item: string) => {
    if (!loading) {
      if (state !== 'add') setState('add');
      setToggleAddItem(!toggleAddItem);
      try {
        await addItem({
          variables: {
            data: {
              nameInput: item,
              listId: currentListId
            }
          }
        });
      } catch (err) {
        console.error('Error on Add Item mutation: ', err);
      }
    }
  };

  return (
    <>
      <div className="fixed right-6 bottom-6">
        <AddItemIcon toggleAddItem={() => setToggleAddItem(!toggleAddItem)} />
      </div>
      {toggleAddItem && (
        <Modal
          exit={() => setToggleAddItem(!toggleAddItem)}
          title="Add Item"
          component={
            <SingleInput
              handleAdd={handleAddItem}
              placeholderText="Enter item name"
            />
          }
        />
      )}
    </>
  );
}
