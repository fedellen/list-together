import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import {
  useGetUsersListsQuery,
  useShareListMutation
} from 'src/generated/graphql';
import * as yup from 'yup';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import FormikTextInput from '../form/FormikTextInput';
import PrivilegeButton from '../shared/PrivilegeButton';
import { UserPrivileges } from 'src/types';

export default function ShareList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const { data, refetch } = useGetUsersListsQuery({
    notifyOnNetworkStatusChange: true
  });
  const [shareList, { loading }] = useShareListMutation({});
  const [privilege, setPrivilege] = useState<UserPrivileges>('read');

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('A valid email must be entered..')
      .required('A valid email must be entered..')
  });

  const currentListName = data?.getUsersLists.userToList?.find(
    (list) => list.listId === currentListId
  )?.list.title;

  const handleShareList = async (email: string) => {
    if (!loading) {
      try {
        const { data } = await shareList({
          variables: {
            data: { listId: currentListId, email: email, privileges: privilege }
          }
        });
        if (data?.shareList.errors) {
          errorNotifaction(data.shareList.errors, dispatch);
        } else {
          dispatch({ type: 'CLEAR_LIST' });
          refetch();
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error in Remove List mutation : ', err);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        email: ''
      }}
      validationSchema={validationSchema}
      onSubmit={({ email }) => handleShareList(email)}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-8 w-full max-w-xs px-2"
        >
          <span className="text-2xl md:text-3xl col-span-2 text-center font-extrabold ">{`" ${currentListName} "`}</span>

          <FormikTextInput name="email" placeholder="email address" />
          <PrivilegeButton privilege={privilege} setPrivilege={setPrivilege} />
          <div className="flex gap-12 ">
            <button
              onClick={() => closeModal(dispatch)}
              className="button-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="button">
              Share
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
