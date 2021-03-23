import { useState } from 'react';
import { useStateValue } from 'src/state/state';
import { sendNotification } from 'src/utils/dispatchActions';
import { useField } from 'src/hooks/useField';
import useUsersEmail from 'src/hooks/fragments/useUsersEmail';
import { useDeleteAccountMutation } from 'src/generated/graphql';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

import { useApolloClient } from '@apollo/client';

export default function ManageAccount() {
  const [, dispatch] = useStateValue();
  const userEmail = useUsersEmail();

  /** State for handling the `PrivilegeButton` */

  /** Confirm e-mail input field */
  const emailInput = useField();

  const [deleteAccount] = useDeleteAccountMutation();
  const apolloClient = useApolloClient();

  const [submit, setSubmit] = useState(false);
  const triggerSubmit = useDelayedFunction(() => setSubmit(false));

  /** send shareList Mutation */
  const handleDeleteAccount = async () => {
    console.log('submit', submit);
    if (!submit) {
      setSubmit(true);
      if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        sendNotification(dispatch, ['That is not a valid email address..']);
        triggerSubmit(2000);
        return;
      } else if (emailInput.value !== userEmail) {
        sendNotification(dispatch, ['That email address does not match..']);
        triggerSubmit(2000);
      } else {
        try {
          const { data } = await deleteAccount();
          if (data?.deleteAccount !== true) {
            sendNotification(dispatch, [
              'An unexpected error has occurred while trying to delete your account. Please contact support@pixelpajamastudios.com if the problem persists.'
            ]);
            triggerSubmit(2000);
          } else {
            await apolloClient.resetStore();
            dispatch({ type: 'CLEAR_STATE' });
            dispatch({ type: 'SET_USER', payload: '' });
            dispatch({ type: 'SET_APP_STATE', payload: 'home' });
          }
        } catch (err) {
          console.error('Error in Share List mutation : ', err);
        }
      }
    }
  };

  /** No Keyboard submit 🔥 */
  // const submitKeyPress = useKeyPress('Enter');
  // if (submitKeyPress && !submit) handleDeleteAccount();

  const [deleteClicked, setDeleteClicked] = useState(false);

  return (
    <div className="modal-component">
      <span className="text-label">Your Email Address:</span>
      <span className="shared-email text-xs sm:text-sm p-2 lg:text-base font-bold overflow-x-auto">
        {userEmail}
      </span>
      {deleteClicked ? (
        <div className="confirm-delete flex flex-col">
          <span className="text-xxs md:text-xs p-2 md:p-4 font-semibold text-center text-red-800">
            This action is irreversible. Your account information and all list
            data will be permanently erased from our database.
          </span>
          <span className="text-label">
            Please enter your email to confirm account deletion:
          </span>

          <input
            {...emailInput}
            type="email"
            placeholder="email address"
            aria-label="Email address to share list to"
          />

          <div className="modal-buttons mt-2 md:mt-4">
            <button
              onClick={() => handleDeleteAccount()}
              className="button-delete"
              aria-label="Delete account from database"
            >
              Delete Account
            </button>
            <button
              onClick={() => dispatch({ type: 'CLEAR_STATE' })}
              className="button-secondary"
              aria-label="Close Modal"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-buttons mt-2 md:mt-4">
          <button
            onClick={() => setDeleteClicked(true)}
            className="button-delete"
            aria-label="Delete account from database"
          >
            Delete Account
          </button>
          <button
            onClick={() => dispatch({ type: 'CLEAR_STATE' })}
            className="button-secondary"
            aria-label="Close Modal"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
