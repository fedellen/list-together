import { useState } from 'react';
import { useAddItemMutation } from 'src/generated/graphql';
import { SingleInput } from './SingleInput';
import { AddItemIcon } from './svg/AddItemIcon';
import { SideMenuStates } from './UsersLists';

type SideMenuProps = {
  state: SideMenuStates;
  setState: (arg: SideMenuStates) => void;
  currentListId: string;
};

export function SideMenu({ state, setState, currentListId }: SideMenuProps) {
  const [addItem, { loading }] = useAddItemMutation();
  const [toggleInput, setToggleInput] = useState(false);

  const handleAddItem = async (item: string) => {
    if (!loading) {
      if (state !== 'add') setState('add');
      setToggleInput(!toggleInput);
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
    <div className="fixed right-6 bottom-6">
      {toggleInput && (
        <SingleInput
          purpose="addItem"
          handleAdd={handleAddItem}
          handleExit={() => setToggleInput(!toggleInput)}
        />
      )}
      <AddItemIcon toggleAddItem={() => setToggleInput(!toggleInput)} />
    </div>
  );
}
