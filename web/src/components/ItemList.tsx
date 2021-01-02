import { useState } from 'react';
import {
  List,
  ListFragmentFragmentDoc,
  useAddNoteMutation,
  useDeleteItemsMutation
} from 'src/generated/graphql';
import { ToggleItemState, UserPrivileges, SideMenuState } from '../types';
import Button from './Button';
import ItemOptions from './ItemOptions';
import Modal from './Modal';
import SingleInput from './SingleInput';
import SingleItem from './SingleItem';

type ItemListProps = {
  /** Current list being displayed */
  list: List;
  /** State of side menu to determine which actions to take on item click */
  sideMenuState: SideMenuState;
  /** Array of user's privileges for current list */
  userPrivileges: UserPrivileges[];
};

/** Actions to take from user clicking on `ItemOptions` modal */
export type OptionAction =
  | 'addNote'
  | 'strikeItem'
  | 'boldItem'
  | 'deleteItem'
  | 'sortItemUp'
  | 'sortItemDown';

export default function ItemList({
  list,
  sideMenuState,
  userPrivileges
}: ItemListProps) {
  /** State for handling which Item modal is open */
  const [toggleItemState, setToggleItemState] = useState<ToggleItemState>({
    active: false,
    itemName: '',
    type: 'options'
  });

  const [addNote] = useAddNoteMutation();
  const [deleteItems] = useDeleteItemsMutation();

  const handleItemClick = (itemName: string) => {
    if (sideMenuState === 'add') {
      setToggleItemState({
        active: true,
        itemName: itemName,
        type: 'options'
      });
    } else if (sideMenuState === 'shop') {
      /** Use strikethrough mutation */
    } else if (sideMenuState === 'sort') {
      /** Handle dragging item */
    }
  };

  const handleOptionAction = (optionAction: OptionAction) => {
    switch (optionAction) {
      case 'addNote':
        return setToggleItemState({ ...toggleItemState, type: 'addNote' });
      case 'deleteItem':
        return setToggleItemState({ ...toggleItemState, type: 'deleteItem' });
      case 'boldItem':
      /** Use bold mutation */
      case 'strikeItem':
      /** Use strike mutation */
      case 'sortItemUp':
      /** Handle moving item up one position */
      case 'sortItemDown':
      /** Handle moving item down one position */
      default:
        throw new Error('Invalid option action type in ItemList function..');
    }
  };

  const toggledModal = () => {
    if (!toggleItemState.active) return <div />;

    if (toggleItemState.type === 'options') {
      return (
        <Modal
          title={toggleItemState.itemName}
          exit={() => setToggleItemState({ ...toggleItemState, active: false })}
          component={
            <ItemOptions
              // itemName={toggleItemState.itemName}
              handleOptionAction={handleOptionAction}
              userPrivileges={userPrivileges}
            />
          }
        />
      );
    } else if (toggleItemState.type === 'addNote') {
      return (
        <Modal
          title={`Add Note: ${toggleItemState.itemName}`}
          exit={() => setToggleItemState({ ...toggleItemState, active: false })}
          component={
            <SingleInput
              placeholderText={'Enter your note'}
              handleAdd={async (note) => {
                setToggleItemState({ ...toggleItemState, active: false });
                try {
                  await addNote({
                    variables: {
                      data: {
                        itemName: toggleItemState.itemName,
                        listId: list.id,
                        note: note
                      }
                    }
                  });
                } catch (err) {
                  console.error(`Error on Add Note mutation: ${err}`);
                }
              }}
            />
          }
        />
      );
    } else if (toggleItemState.type === 'deleteItem') {
      return (
        <Modal
          title={`Delete Item: ${toggleItemState.itemName}?`}
          exit={() => setToggleItemState({ ...toggleItemState, active: false })}
          component={
            <>
              <Button
                text="Confirm"
                onClick={async () => {
                  setToggleItemState({ ...toggleItemState, active: false });
                  try {
                    await deleteItems({
                      variables: {
                        data: {
                          itemNameArray: [toggleItemState.itemName],
                          listId: list.id
                        }
                      },
                      update: (cache, { data }) => {
                        if (data?.deleteItems.list) {
                          cache.writeFragment({
                            fragment: ListFragmentFragmentDoc,
                            data: data.deleteItems.list,
                            fragmentName: 'listFragment'
                          });
                        }
                      }
                    });
                  } catch (err) {
                    console.error(`Error on Delete Item mutation: ${err}`);
                  }
                }}
              />
              <Button
                text="Cancel"
                onClick={() => {
                  setToggleItemState({ ...toggleItemState, active: false });
                }}
              />
            </>
          }
        />
      );
    } else {
      return <div />;
    }
  };

  return (
    <>
      {toggledModal()}
      <div className="pl-10">
        {list.items &&
          list.items.map((i) => (
            <SingleItem
              item={i}
              key={i.name}
              handleItemClick={(itemName) => handleItemClick(itemName)}
            />
          ))}
      </div>
    </>
  );
}
