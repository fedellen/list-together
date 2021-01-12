import { Formik, Form, Field } from 'formik';
import {
  GetUsersListsDocument,
  GetUsersListsQuery,
  // GetUsersListsQueryResult,
  useAddItemMutation,
  useAddNoteMutation,
  useCreateListMutation,
  useGetUsersListsQuery
} from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { errorNotifaction } from 'src/utils/errorNotification';
import Button from '../Button';

/** Single input component for mutations:
 *  `addItem` | `createList` | `addNote` */

export default function SingleInput({}) {
  const [{ modalState, currentListId }, dispatch] = useStateValue();
  const { data /*, refetch*/ } = useGetUsersListsQuery({ skip: true });

  const [addItem, { loading: addItemLoading }] = useAddItemMutation();
  const [addNote, { loading: addNoteLoading }] = useAddNoteMutation();
  const [createList, { loading: createListLoading }] = useCreateListMutation({
    // onCompleted: () => refetch()
  });

  const closeModal = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: false }
    });
  };

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
          closeModal();
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
            closeModal();
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
          },
          update: (cache, { data }) => {
            if (data?.createList.userToList) {
              const currentLists = cache.readQuery<GetUsersListsQuery>({
                query: GetUsersListsDocument
              });
              console.log(currentLists);
              let updatedLists;
              if (currentLists?.getUsersLists.userToList) {
                updatedLists = {
                  ...currentLists.getUsersLists,
                  userToList: [
                    ...currentLists.getUsersLists.userToList,
                    data.createList.userToList[0]
                  ]
                };
                console.log(updatedLists);
                cache.writeQuery({
                  query: GetUsersListsDocument,
                  data: { getUsersLists: updatedLists }
                });
              }
            }
          }
        });
        if (data?.createList.errors) {
          errorNotifaction(data.createList.errors, dispatch);
        } else {
          closeModal();
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
          className="flex flex-col justify-center items-center p-2 gap-2"
        >
          <Field
            id="text"
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