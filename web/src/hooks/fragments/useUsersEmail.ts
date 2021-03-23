import { User } from 'src/generated/graphql';
import { useStateValue } from 'src/state/state';
import useFragment from '../useFragment';

export default function useUsersEmail(): string {
  const [{ currentUserId }] = useStateValue();
  const userFragment = useFragment({
    fragmentField: ['User', 'email'],
    id: currentUserId
  }) as User | null;

  if (!userFragment || !userFragment.email) return '';
  return userFragment.email;
}
