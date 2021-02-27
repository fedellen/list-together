import { UserToList } from 'src/generated/graphql';
import { UserPrivileges } from 'src/types';
import useFragment from '../useFragment';
import { useStateValue } from 'src/state/state';

export default function useCurrentPrivileges(): UserPrivileges {
  const [{ currentListId }] = useStateValue();
  const userToListFragment = useFragment({
    fragmentField: ['UserToList', 'privileges'],
    id: currentListId
  }) as UserToList | null;

  // Privileges were not found in cache, return read only
  if (!userToListFragment) return 'read';

  // Postgres only saves `UserPrivileges`
  return userToListFragment.privileges as UserPrivileges;
}
