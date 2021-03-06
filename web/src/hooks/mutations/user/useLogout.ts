import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import { useLogoutUserMutation } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';

export default function useLogout() {
  const [, dispatch] = useStateValue();
  const apolloClient = useApolloClient();
  const [logout] = useLogoutUserMutation();

  const sendMutation = useCallback(async () => {
    /**
     *  Logout Mutation
     */
    try {
      await logout();
      // await apolloClient.clearStore(); // Might need this when persisting cache
      await apolloClient.resetStore();
      dispatch({ type: 'CLEAR_STATE' });
      dispatch({ type: 'SET_USER', payload: '' });
      dispatch({ type: 'SET_APP_STATE', payload: 'home' });
    } catch (err) {
      console.error('Error on logout mutation: ', err);
    }
  }, []);

  return [sendMutation] as const;
}
