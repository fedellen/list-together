import { useState } from 'react';
import {
  useAddItemMutation,
  useAddNoteMutation,
  useCreateListMutation,
  useGetUserQuery,
  useGetUsersListsQuery,
  useRenameListMutation
} from 'src/generated/graphql';
import useCurrentMostCommonWords from 'src/hooks/fragments/useCurrentMostCommonWords';
import useCurrentSortedItems from 'src/hooks/fragments/useCurrentSortedItems';
import useKeyPress from 'src/hooks/useKeyPress';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import Button from '../styled/Button';
import AutoCompleteItems from './AutoCompleteItems';

/**
 * Single input component to be placed inside `Modal`
 * This component uses the following  mutations:
 * `addItem` | `createList` | `addNote` | `renameList`
 */

export default function SingleInput({}) {
  const [{ modalState, currentListId }, dispatch] = useStateValue();
  const { data, refetch: refetchLists } = useGetUsersListsQuery({ skip: true });
  const { refetch: refetchUser } = useGetUserQuery({ skip: true });

  const [addItem] = useAddItemMutation();
  const [addNote] = useAddNoteMutation();
  const [createList] = useCreateListMutation();
  const [renameList] = useRenameListMutation();

  const [submit, setSubmit] = useState(false);

  /** Use `addItem` mutation for default values */
  let placeholderText = 'Enter item name';
  let handleAdd = async (text: string) => {
    const userList = data?.getUsersLists.userToList?.find(
      (userList) => userList.listId === currentListId
    );
    const itemsOnList = userList?.list.items?.map((item) => item.name);
    if (itemsOnList?.includes(text)) {
      errorNotifaction(
        [{ field: 'name', message: 'Item exists on this list already..' }],
        dispatch
      );
    } else {
      setSubmit(true);
      try {
        const { data } = await addItem({
          variables: {
            data: {
              nameInput: text,
              listId: currentListId
            }
          }
        });
        if (data?.addItem.errors) {
          errorNotifaction(data.addItem.errors, dispatch);
          setSubmit(false);
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error on Add Item mutation: ', err);
      }
    }
  };

  /** addNote mutation */
  if (modalState.type === 'addNote') {
    placeholderText = 'Enter your note';
    handleAdd = async (text: string) => {
      if (!modalState.itemName) {
        console.error('No item name in context for addNote mutation..');
      } else {
        setSubmit(true);
        try {
          const { data } = await addNote({
            variables: {
              data: {
                itemName: modalState.itemName,
                listId: currentListId,
                note: text
              }
            }
          });
          if (data?.addNote.errors) {
            errorNotifaction(data.addNote.errors, dispatch);
            setSubmit(false);
          } else {
            closeModal(dispatch);
          }
        } catch (err) {
          console.error(`Error on Add Note mutation: ${err}`);
        }
      }
    };
  } else if (modalState.type === 'createList') {
    placeholderText = 'Enter list name';
    /** createList mutation  */
    handleAdd = async (text: string) => {
      setSubmit(true);
      try {
        const { data } = await createList({
          variables: {
            title: text
          }
        });
        if (data?.createList.errors) {
          errorNotifaction(data.createList.errors, dispatch);
          setSubmit(false);
        } else {
          await refetchUser();
          await refetchLists();
          dispatch({ type: 'CLEAR_LIST' });
          closeModal(dispatch);
        }
      } catch (err) {
        console.error(`Error on Create list mutation: ${err}`);
      }
    };
  } else if (modalState.type === 'renameList') {
    placeholderText = 'Enter new list name';
    /** Rename list mutation */
    handleAdd = async (text: string) => {
      setSubmit(true);
      try {
        const { data } = await renameList({
          variables: {
            name: text,
            listId: currentListId
          }
        });
        if (data?.renameList.errors) {
          errorNotifaction(data.renameList.errors, dispatch);
          setSubmit(false);
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error(`Error on Rename List mutation: ${err}`);
      }
    };
  }

  const [textValue, setTextValue] = useState('');
  const currentItemsArray = useCurrentSortedItems();
  const mostCommonWords = useCurrentMostCommonWords();
  const commonWordsWithoutCurrentItems = mostCommonWords?.filter(
    (word) => !currentItemsArray?.includes(word)
  );

  const autoCompleteList = commonWordsWithoutCurrentItems?.filter(
    (word) => word.toLowerCase().indexOf(textValue.toLowerCase()) !== -1
  );

  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleAdd(textValue);

  return (
    <div className="single-input">
      <input
        onChange={(e) => setTextValue(e.target.value)}
        value={textValue}
        placeholder={placeholderText}
        autoFocus
      />
      <Button
        text="Submit"
        isLoading={submit}
        onClick={!submit ? () => handleAdd(textValue) : undefined}
      />
      {modalState.type === 'addItem' && autoCompleteList && (
        <AutoCompleteItems
          handleAdd={handleAdd}
          filteredWords={autoCompleteList}
        />
      )}
    </div>
  );
}
