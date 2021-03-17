import { useState } from 'react';
import { useShareListMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { errorNotification } from 'src/utils/errorNotification';
import PrivilegeButton from '../shared/PrivilegeButton';
import { UserPrivileges } from 'src/types';
import useKeyPress from 'src/hooks/useKeyPress';
import ModalButtons from './ModalButtons';
import CurrentListTitle from '../shared/CurrentListTitle';
import { useField } from 'src/hooks/useField';

export default function ShareList() {
  const [{ currentListId }, dispatch] = useStateValue();

  /** State for handling the `PrivilegeButton` */
  const [privilege, setPrivilege] = useState<UserPrivileges>('delete');
  /** Email input field */
  const emailInput = useField();

  const [shareList] = useShareListMutation({});
  const [submit, setSubmit] = useState(false);
  /** send shareList Mutation */
  const handleShareList = async () => {
    if (!submit) {
      setSubmit(true);
      if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        sendNotification(dispatch, ['That is not a valid email address..']);
        setTimeout(() => setSubmit(false), 2000);
        return;
      }
      try {
        const { data } = await shareList({
          variables: {
            data: {
              listId: currentListId,
              email: emailInput.value,
              privileges: privilege
            }
          }
        });
        if (data?.shareList.errors) {
          errorNotification(data.shareList.errors, dispatch);
          setTimeout(() => setSubmit(false), 2000);
        } else {
          dispatch({ type: 'CLEAR_STATE' });
        }
      } catch (err) {
        console.error('Error in Share List mutation : ', err);
      }
    }
  };
  /** Keyboard submit */
  const submitKeyPress = useKeyPress('Enter');
  if (submitKeyPress && !submit) handleShareList();

  return (
    <div className="modal-component mt-3 gap-1 sm:mt-4">
      <CurrentListTitle />

      <span className="text-label">User&lsquo;s Email Address:</span>
      <input
        {...emailInput}
        type="email"
        placeholder="email address"
        aria-label="Email address to share list to"
      />
      <PrivilegeButton privilege={privilege} setPrivilege={setPrivilege} />
      <ModalButtons
        primaryClick={() => handleShareList()}
        secondaryClick={() => dispatch({ type: 'CLEAR_STATE' })}
        buttonText="Add"
      />
    </div>
  );
}
