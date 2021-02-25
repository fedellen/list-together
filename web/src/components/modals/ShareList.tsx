import React, { useState } from 'react';
import { useShareListMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { closeModal, sendNotification } from 'src/utils/dispatchActions';
import { errorNotifaction } from 'src/utils/errorNotification';
import PrivilegeButton from '../shared/PrivilegeButton';
import { UserPrivileges } from 'src/types';
import useCurrentListName from 'src/hooks/useCurrentListName';
import useKeyPress from 'src/hooks/useKeyPress';

export default function ShareList() {
  const [{ currentListId }, dispatch] = useStateValue();
  const [shareList] = useShareListMutation({});
  /** State for handling the `PrivilegeButton` */
  const [privilege, setPrivilege] = useState<UserPrivileges>('delete');

  const [submit, setSubmit] = useState(false);
  /** shareList Mutation */
  const handleShareList = async () => {
    if (!submit) {
      setSubmit(true);
      if (!email.includes('@') || !email.includes('.')) {
        sendNotification(dispatch, ['That is not a valid email address..']);
        setTimeout(() => setSubmit(false), 2000);
        return;
      }
      try {
        const { data } = await shareList({
          variables: {
            data: { listId: currentListId, email: email, privileges: privilege }
          }
        });
        if (data?.shareList.errors) {
          errorNotifaction(data.shareList.errors, dispatch);
          setTimeout(() => setSubmit(false), 2000);
        } else {
          closeModal(dispatch);
        }
      } catch (err) {
        console.error('Error in Share List mutation : ', err);
      }
    }
  };
  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleShareList();

  const [email, setEmail] = useState(''); // Email input field
  const currentListName = useCurrentListName();

  return (
    <div className="flex flex-col items-start gap-10 max-w-xs md:max-w-sm">
      <div className="flex mt-4">
        <span className="text-label">List Title:</span>
        <span className="list-title">{currentListName}</span>
      </div>

      <div className="flex flex-col w-full">
        <span className="text-label">User&lsquo;s Email Address:</span>
        <input
          name="email"
          type="email"
          placeholder="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <PrivilegeButton privilege={privilege} setPrivilege={setPrivilege} />
      <div className="flex w-full justify-between px-4">
        <button
          onClick={() => closeModal(dispatch)}
          className="button-secondary"
        >
          Cancel
        </button>
        <button onClick={() => handleShareList()} className="button">
          Share
        </button>
      </div>
    </div>
  );
}
