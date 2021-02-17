import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useShareListMutation } from 'src/generated/graphql';
import * as yup from 'yup';
import { useStateValue } from 'src/state/state';
import { closeModal } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import FormikTextInput from '../form/FormikTextInput';
import PrivilegeButton from '../shared/PrivilegeButton';
import { UserPrivileges } from 'src/types';
import useCurrentListName from 'src/hooks/fragmentHooks/useCurrentListName';

export default function ShareList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const [shareList, { loading }] = useShareListMutation({});
  /** State for handling the `PrivilegeButton` */
  const [privilege, setPrivilege] = useState<UserPrivileges>('delete');

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('A valid email must be entered..')
      .required('A valid email must be entered..')
  });

  const currentListName = useCurrentListName();

  /** shareList Mutation */
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
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error in Share List mutation : ', err);
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
          className="flex flex-col items-start gap-10 max-w-xs md:max-w-sm"
        >
          <div className="flex mt-4">
            <span className="text-label">List Title:</span>
            <span className="list-title">{currentListName}</span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-label">User&lsquo;s Email Address:</span>
            <FormikTextInput name="email" placeholder="email address" />
          </div>
          <PrivilegeButton privilege={privilege} setPrivilege={setPrivilege} />
          <div className="flex w-full justify-between px-4">
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
