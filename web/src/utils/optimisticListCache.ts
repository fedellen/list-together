import { ApolloClient, gql } from '@apollo/client';

export type CachedItem = {
  __typename: 'Item';
  id: string;
  name: string;
  notes: string[];
  strike: boolean;
};

export type CachedList = {
  __typename: 'List';
  id: string;
  items: CachedItem[];
};

export type CachedUserToList = {
  __typename: 'UserToList';
  sortedItems: string[];
};

export type ListCacheSnapshot = {
  listId: string;
  previousList: CachedList | null;
  previousUserToList: CachedUserToList | null;
};

function getListCacheId(listId: string) {
  return `List:${listId}`;
}

function getUserToListCacheId(listId: string) {
  return `UserToList:{"listId":"${listId}"}`;
}

/**
 * TODO(iteration-3): Prefer a server snapshot mutation that accepts client
 * list state wholesale, then reduce local rollback complexity.
 */
export function snapshotListCache(
  client: ApolloClient<Record<string, unknown>>,
  listId: string
): ListCacheSnapshot {
  const previousList = client.readFragment<CachedList>({
    id: getListCacheId(listId),
    fragment: gql`
      fragment optimisticCachedList on List {
        id
        items {
          id
          name
          notes
          strike
        }
      }
    `
  });

  const previousUserToList = client.readFragment<CachedUserToList>({
    id: getUserToListCacheId(listId),
    fragment: gql`
      fragment optimisticCachedUserToList on UserToList {
        sortedItems
      }
    `
  });

  return {
    listId,
    previousList,
    previousUserToList
  };
}

export function applyOptimisticAddItem(
  client: ApolloClient<Record<string, unknown>>,
  listId: string,
  itemName: string,
  fallbackSortedItems: string[]
) {
  const listCacheId = getListCacheId(listId);
  const userToListCacheId = getUserToListCacheId(listId);

  const previousList = client.readFragment<CachedList>({
    id: listCacheId,
    fragment: gql`
      fragment optimisticAddReadList on List {
        id
        items {
          id
          name
          notes
          strike
        }
      }
    `
  });

  const nextItems = [...(previousList?.items ?? [])];
  if (!nextItems.some((cachedItem) => cachedItem.name === itemName)) {
    nextItems.push({
      __typename: 'Item',
      id: `optimistic-item-${listId}-${itemName}-${Date.now()}`,
      name: itemName,
      notes: [],
      strike: false
    });
  }

  client.writeFragment({
    id: listCacheId,
    fragment: gql`
      fragment optimisticAddWriteList on List {
        id
        items {
          id
          name
          notes
          strike
        }
      }
    `,
    data: {
      __typename: 'List',
      id: listId,
      items: nextItems
    }
  });

  const previousUserToList = client.readFragment<CachedUserToList>({
    id: userToListCacheId,
    fragment: gql`
      fragment optimisticAddReadUserToList on UserToList {
        sortedItems
      }
    `
  });

  const nextSortedItems = previousUserToList?.sortedItems
    ? [...previousUserToList.sortedItems]
    : [...fallbackSortedItems];

  if (!nextSortedItems.includes(itemName)) {
    nextSortedItems.push(itemName);
  }

  client.writeFragment({
    id: userToListCacheId,
    fragment: gql`
      fragment optimisticAddWriteUserToList on UserToList {
        sortedItems
      }
    `,
    data: {
      __typename: 'UserToList',
      sortedItems: nextSortedItems
    }
  });
}

export function applyOptimisticDeleteItems(
  client: ApolloClient<Record<string, unknown>>,
  listId: string,
  itemNames: string[]
) {
  const listCacheId = getListCacheId(listId);
  const userToListCacheId = getUserToListCacheId(listId);

  const previousList = client.readFragment<CachedList>({
    id: listCacheId,
    fragment: gql`
      fragment optimisticDeleteReadList on List {
        id
        items {
          id
          name
          notes
          strike
        }
      }
    `
  });

  if (previousList) {
    client.writeFragment({
      id: listCacheId,
      fragment: gql`
        fragment optimisticDeleteWriteList on List {
          id
          items {
            id
            name
            notes
            strike
          }
        }
      `,
      data: {
        __typename: 'List',
        id: listId,
        items: previousList.items.filter(
          (cachedItem) => !itemNames.includes(cachedItem.name)
        )
      }
    });
  }

  const previousUserToList = client.readFragment<CachedUserToList>({
    id: userToListCacheId,
    fragment: gql`
      fragment optimisticDeleteReadUserToList on UserToList {
        sortedItems
      }
    `
  });

  if (previousUserToList) {
    client.writeFragment({
      id: userToListCacheId,
      fragment: gql`
        fragment optimisticDeleteWriteUserToList on UserToList {
          sortedItems
        }
      `,
      data: {
        __typename: 'UserToList',
        sortedItems: previousUserToList.sortedItems.filter(
          (itemName) => !itemNames.includes(itemName)
        )
      }
    });
  }
}

export function rollbackListCache(
  client: ApolloClient<Record<string, unknown>>,
  snapshot: ListCacheSnapshot
) {
  const listCacheId = getListCacheId(snapshot.listId);
  const userToListCacheId = getUserToListCacheId(snapshot.listId);

  if (snapshot.previousList) {
    client.writeFragment({
      id: listCacheId,
      fragment: gql`
        fragment optimisticRollbackList on List {
          id
          items {
            id
            name
            notes
            strike
          }
        }
      `,
      data: snapshot.previousList
    });
  }

  if (snapshot.previousUserToList) {
    client.writeFragment({
      id: userToListCacheId,
      fragment: gql`
        fragment optimisticRollbackUserToList on UserToList {
          sortedItems
        }
      `,
      data: snapshot.previousUserToList
    });
  }
}
