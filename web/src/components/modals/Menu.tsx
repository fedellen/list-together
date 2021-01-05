import { useApolloClient } from '@apollo/client';
import { useGetUserQuery, useLogoutUserMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import Button from '../Button';

export const Menu = () => {
  const [, dispatch] = useStateValue();

  const [logout] = useLogoutUserMutation();
  const { data } = useGetUserQuery();

  const apolloClient = useApolloClient();

  if (!data?.getUser) {
    console.error('Menu opened without user in context..');
    return <div />;
  }

  const handleLogout = async () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: false }
    });
    await logout();
    apolloClient.clearStore();
  };

  const toggleCreateList = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: false, type: 'createList' }
    });
  };

  const toggleShareList = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { active: false, type: 'shareList' }
    });
  };

  return (
    <>
      {/*Menu options*/}

      <Button text="New List" onClick={toggleCreateList} />
      <Button text="Share List" onClick={toggleShareList} />
      <Button text="Logout" onClick={handleLogout} />
    </>
  );
};
