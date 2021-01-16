import { useApolloClient } from '@apollo/client';
import { useGetUserQuery, useLogoutUserMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import { openModal, setAppState } from 'src/utils/dispatchActions';
import Button from '../Button';

export const Menu = () => {
  const [, dispatch] = useStateValue();
  const [logout] = useLogoutUserMutation();
  const { data } = useGetUserQuery();

  const apolloClient = useApolloClient();

  const handleLogout = async () => {
    try {
      await logout();
      // await apolloClient.clearStore();
      await apolloClient.resetStore();
      setAppState(dispatch, 'home');
    } catch (err) {
      console.error('Error on logout mutation: ', err);
    }
  };

  return (
    <>
      {data?.getUser ? (
        /** User is logged in */
        <>
          <Button
            text="New List"
            onClick={() => openModal(dispatch, 'createList')}
          />
          <Button
            text="Share List"
            onClick={() => openModal(dispatch, 'shareList')}
          />
          <Button
            text="Remove List"
            onClick={() => openModal(dispatch, 'removeList')}
          />
          <Button text="Logout" onClick={handleLogout} />{' '}
        </>
      ) : (
        /** No user logged in */
        <>
          <Button text="Home" onClick={() => setAppState(dispatch, 'home')} />
          <Button text="Login" onClick={() => setAppState(dispatch, 'login')} />
          <Button
            text="New User"
            onClick={() => setAppState(dispatch, 'createUser')}
          />
          <Button text="Demo" onClick={() => setAppState(dispatch, 'demo')} />
        </>
      )}
    </>
  );
};
