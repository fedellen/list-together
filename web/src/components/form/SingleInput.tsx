import { Formik, Form, Field } from 'formik';
import {
  useAddItemMutation,
  useAddNoteMutation,
  useCreateListMutation,
  useGetUserQuery,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import Button from '../styled/Button';

/**
 * Single input modal component for mutations:
 * `addItem` | `createList` | `addNote`
 */

export default function SingleInput({}) {
  const [{ modalState, currentListId }, dispatch] = useStateValue();
  const { data, refetch: refetchLists } = useGetUsersListsQuery({ skip: true });
  const { refetch: refetchUser } = useGetUserQuery({ skip: true });

  const [addItem, { loading: addItemLoading }] = useAddItemMutation();
  const [addNote, { loading: addNoteLoading }] = useAddNoteMutation();
  const [createList, { loading: createListLoading }] = useCreateListMutation();

  /** Use `addItem` mutation for default values */
  let placeholderText = 'Enter item name';
  let isLoading = addItemLoading;
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
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error on Add Item mutation: ', err);
      }
    }
  };

  /** addNote mutation values */
  if (modalState.type === 'addNote') {
    placeholderText = 'Enter your note';
    isLoading = addNoteLoading;
    handleAdd = async (text: string) => {
      if (!modalState.itemName) {
        console.error('No item name in context for addNote mutation..');
      } else {
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
          } else {
            closeModal(dispatch);
          }
        } catch (err) {
          console.error(`Error on Add Note mutation: ${err}`);
        }
      }
    };

    /** createList mutation values */
  } else if (modalState.type === 'createList') {
    placeholderText = 'Enter list name';
    isLoading = createListLoading;
    handleAdd = async (text: string) => {
      try {
        const { data } = await createList({
          variables: {
            title: text
          }
        });
        if (data?.createList.errors) {
          errorNotifaction(data.createList.errors, dispatch);
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
  }

  return (
    <Formik
      initialValues={{
        text: ''
      }}
      onSubmit={(values) => handleAdd(values.text)}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          <Field
            id="text"
            className="mb-7"
            name="text"
            type="text"
            label="text"
            autoFocus={true}
            placeholder={placeholderText}
          />

          <Button type="submit" text="Submit" isLoading={isLoading} />
        </Form>
      )}
    </Formik>
  );
}
