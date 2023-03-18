import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddItemInput = {
  listId: Scalars['String'];
  nameInput: Array<Scalars['String']>;
};

export type AddNoteInput = {
  itemName: Scalars['String'];
  listId: Scalars['String'];
  note: Scalars['String'];
};

export type DeleteItemsInput = {
  itemNameArray: Array<Scalars['String']>;
  listId: Scalars['String'];
};

export type DeleteNoteInput = {
  itemName: Scalars['String'];
  listId: Scalars['String'];
  note: Scalars['String'];
};

export type EditItemNameInput = {
  itemName: Scalars['String'];
  listId: Scalars['String'];
  newItemName: Scalars['String'];
};

export type EditNoteInput = {
  itemName: Scalars['String'];
  listId: Scalars['String'];
  newNote: Scalars['String'];
  note: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID'];
  name: Scalars['String'];
  notes?: Maybe<Array<Scalars['String']>>;
  strike: Scalars['Boolean'];
};

export type ItemHistory = {
  __typename?: 'ItemHistory';
  id: Scalars['ID'];
  item: Scalars['String'];
  removalRating?: Maybe<Scalars['Int']>;
};

export type ItemResponse = {
  __typename?: 'ItemResponse';
  errors?: Maybe<Array<FieldError>>;
  item?: Maybe<Item>;
};

export type List = {
  __typename?: 'List';
  id: Scalars['ID'];
  items?: Maybe<Array<Item>>;
  title: Scalars['String'];
};

export type ListResponse = {
  __typename?: 'ListResponse';
  errors?: Maybe<Array<FieldError>>;
  list?: Maybe<List>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addItem: UserToListResponse;
  addNote: ItemResponse;
  createList: UserWithListResponse;
  deleteAccount?: Maybe<Scalars['Boolean']>;
  deleteItems: UserToListResponse;
  deleteList: UserResponse;
  deleteNote: ItemResponse;
  editItemName: UserToListResponse;
  editNote: ItemResponse;
  logout: Scalars['Boolean'];
  renameList: ListResponse;
  shareList: UserToListResponse;
  sortItems: UserToListResponse;
  sortLists: UserResponse;
  strikeItem: UserToListResponse;
  submitPreferredOrder: UserToListResponse;
  updatePrivileges: UserToListResponse;
};


export type MutationAddItemArgs = {
  data: AddItemInput;
};


export type MutationAddNoteArgs = {
  data: AddNoteInput;
};


export type MutationCreateListArgs = {
  title: Scalars['String'];
};


export type MutationDeleteItemsArgs = {
  data: DeleteItemsInput;
};


export type MutationDeleteListArgs = {
  listId: Scalars['String'];
};


export type MutationDeleteNoteArgs = {
  data: DeleteNoteInput;
};


export type MutationEditItemNameArgs = {
  data: EditItemNameInput;
};


export type MutationEditNoteArgs = {
  data: EditNoteInput;
};


export type MutationRenameListArgs = {
  listId: Scalars['String'];
  name: Scalars['String'];
};


export type MutationShareListArgs = {
  data: ShareListInput;
};


export type MutationSortItemsArgs = {
  data: StringArrayInput;
  listId: Scalars['String'];
};


export type MutationSortListsArgs = {
  data: StringArrayInput;
};


export type MutationStrikeItemArgs = {
  data: StrikeItemInput;
};


export type MutationSubmitPreferredOrderArgs = {
  data: PreferredOrderInput;
};


export type MutationUpdatePrivilegesArgs = {
  data: UpdatePrivilegesInput;
};

export type PreferredOrderInput = {
  listId: Scalars['String'];
  removedItemArray: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getUser?: Maybe<User>;
  getUsersLists: UserToListResponse;
};

export type ShareListInput = {
  email: Scalars['String'];
  listId: Scalars['String'];
  privileges: Scalars['String'];
};

export type SharedUsers = {
  __typename?: 'SharedUsers';
  email?: Maybe<Scalars['String']>;
  privileges?: Maybe<Scalars['String']>;
  shared: Scalars['Boolean'];
};

export type StrikeItemInput = {
  itemName: Scalars['String'];
  listId: Scalars['String'];
};

export type StringArrayInput = {
  stringArray: Array<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  subscribeToListUpdates: UserToListResponse;
};


export type SubscriptionSubscribeToListUpdatesArgs = {
  listIdArray: Array<Scalars['ID']>;
};

export type UpdatePrivilegesInput = {
  email: Scalars['String'];
  listId: Scalars['String'];
  privileges?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  sortedListsArray?: Maybe<Array<Scalars['String']>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UserToList = {
  __typename?: 'UserToList';
  itemHistory?: Maybe<Array<ItemHistory>>;
  list: List;
  listId: Scalars['ID'];
  mostCommonWords?: Maybe<Array<Scalars['String']>>;
  privileges: Scalars['String'];
  sharedUsers: Array<SharedUsers>;
  smartSortedItems: Array<Scalars['String']>;
  sortedItems?: Maybe<Array<Scalars['String']>>;
  userId: Scalars['ID'];
};

export type UserToListResponse = {
  __typename?: 'UserToListResponse';
  errors?: Maybe<Array<FieldError>>;
  notifications?: Maybe<Array<Scalars['String']>>;
  userToList?: Maybe<Array<UserToList>>;
};

export type UserWithListResponse = {
  __typename?: 'UserWithListResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
  userToList?: Maybe<UserToList>;
};

export type FieldErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type ItemFragmentFragment = { __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean };

export type ItemHistoryFragmentFragment = { __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null };

export type ListFragmentFragment = { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null };

export type ListPartialFragment = { __typename?: 'List', id: string, title: string };

export type UserFragmentFragment = { __typename?: 'User', id: string, email: string, sortedListsArray?: Array<string> | null };

export type UserListFragmentFragment = { __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } };

export type UserListPartialFragment = { __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, sortedItems?: Array<string> | null };

export type UserListWithHistoryFragment = { __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, sortedItems?: Array<string> | null, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null };

export type AddItemMutationVariables = Exact<{
  data: AddItemInput;
}>;


export type AddItemMutation = { __typename?: 'Mutation', addItem: { __typename?: 'UserToListResponse', notifications?: Array<string> | null, userToList?: Array<{ __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type AddNoteMutationVariables = Exact<{
  data: AddNoteInput;
}>;


export type AddNoteMutation = { __typename?: 'Mutation', addNote: { __typename?: 'ItemResponse', item?: { __typename?: 'Item', id: string, notes?: Array<string> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type DeleteItemsMutationVariables = Exact<{
  data: DeleteItemsInput;
}>;


export type DeleteItemsMutation = { __typename?: 'Mutation', deleteItems: { __typename?: 'UserToListResponse', userToList?: Array<{ __typename?: 'UserToList', listId: string, sortedItems?: Array<string> | null, smartSortedItems: Array<string>, list: { __typename?: 'List', id: string, items?: Array<{ __typename?: 'Item', id: string }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type DeleteNoteMutationVariables = Exact<{
  data: DeleteNoteInput;
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote: { __typename?: 'ItemResponse', item?: { __typename?: 'Item', id: string, notes?: Array<string> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type EditItemNameMutationVariables = Exact<{
  data: EditItemNameInput;
}>;


export type EditItemNameMutation = { __typename?: 'Mutation', editItemName: { __typename?: 'UserToListResponse', notifications?: Array<string> | null, userToList?: Array<{ __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type EditNoteMutationVariables = Exact<{
  data: EditNoteInput;
}>;


export type EditNoteMutation = { __typename?: 'Mutation', editNote: { __typename?: 'ItemResponse', item?: { __typename?: 'Item', id: string, notes?: Array<string> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type StrikeItemMutationVariables = Exact<{
  data: StrikeItemInput;
}>;


export type StrikeItemMutation = { __typename?: 'Mutation', strikeItem: { __typename?: 'UserToListResponse', userToList?: Array<{ __typename?: 'UserToList', listId: string, sortedItems?: Array<string> | null, smartSortedItems: Array<string>, list: { __typename?: 'List', id: string, items?: Array<{ __typename?: 'Item', id: string, strike: boolean }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type CreateListMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateListMutation = { __typename?: 'Mutation', createList: { __typename?: 'UserWithListResponse', user?: { __typename?: 'User', id: string, email: string, sortedListsArray?: Array<string> | null } | null, userToList?: { __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type DeleteListMutationVariables = Exact<{
  listId: Scalars['String'];
}>;


export type DeleteListMutation = { __typename?: 'Mutation', deleteList: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, email: string, sortedListsArray?: Array<string> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type RenameListMutationVariables = Exact<{
  name: Scalars['String'];
  listId: Scalars['String'];
}>;


export type RenameListMutation = { __typename?: 'Mutation', renameList: { __typename?: 'ListResponse', list?: { __typename?: 'List', id: string, title: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ShareListMutationVariables = Exact<{
  data: ShareListInput;
}>;


export type ShareListMutation = { __typename?: 'Mutation', shareList: { __typename?: 'UserToListResponse', userToList?: Array<{ __typename?: 'UserToList', listId: string, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }> }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SortItemsMutationVariables = Exact<{
  data: StringArrayInput;
  listId: Scalars['String'];
}>;


export type SortItemsMutation = { __typename?: 'Mutation', sortItems: { __typename?: 'UserToListResponse', userToList?: Array<{ __typename?: 'UserToList', listId: string, sortedItems?: Array<string> | null }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SortListsMutationVariables = Exact<{
  data: StringArrayInput;
}>;


export type SortListsMutation = { __typename?: 'Mutation', sortLists: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, sortedListsArray?: Array<string> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SubmitPreferredOrderMutationVariables = Exact<{
  data: PreferredOrderInput;
}>;


export type SubmitPreferredOrderMutation = { __typename?: 'Mutation', submitPreferredOrder: { __typename?: 'UserToListResponse', userToList?: Array<{ __typename?: 'UserToList', listId: string, smartSortedItems: Array<string>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, removalRating?: number | null }> | null }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type UpdatePrivilegesMutationVariables = Exact<{
  data: UpdatePrivilegesInput;
}>;


export type UpdatePrivilegesMutation = { __typename?: 'Mutation', updatePrivileges: { __typename?: 'UserToListResponse', userToList?: Array<{ __typename?: 'UserToList', listId: string, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }> }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount?: boolean | null };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logout: boolean };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, email: string, sortedListsArray?: Array<string> | null } | null };

export type GetUsersListsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersListsQuery = { __typename?: 'Query', getUsersLists: { __typename?: 'UserToListResponse', notifications?: Array<string> | null, userToList?: Array<{ __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ItemResponseFragment = { __typename?: 'ItemResponse', item?: { __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null };

export type ListResponseFragment = { __typename?: 'ListResponse', list?: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null };

export type UserListResponseFragment = { __typename?: 'UserToListResponse', notifications?: Array<string> | null, userToList?: Array<{ __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null };

export type UserResponseFragment = { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, email: string, sortedListsArray?: Array<string> | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null };

export type UserWithListResponseFragment = { __typename?: 'UserWithListResponse', user?: { __typename?: 'User', id: string, email: string, sortedListsArray?: Array<string> | null } | null, userToList?: { __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null };

export type UpdateListSubscriptionVariables = Exact<{
  listIdArray: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type UpdateListSubscription = { __typename?: 'Subscription', subscribeToListUpdates: { __typename?: 'UserToListResponse', notifications?: Array<string> | null, userToList?: Array<{ __typename?: 'UserToList', userId: string, listId: string, privileges: string, mostCommonWords?: Array<string> | null, smartSortedItems: Array<string>, sortedItems?: Array<string> | null, sharedUsers: Array<{ __typename?: 'SharedUsers', shared: boolean, email?: string | null, privileges?: string | null }>, itemHistory?: Array<{ __typename?: 'ItemHistory', id: string, item: string, removalRating?: number | null }> | null, list: { __typename?: 'List', id: string, title: string, items?: Array<{ __typename?: 'Item', id: string, name: string, notes?: Array<string> | null, strike: boolean }> | null } }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export const ListPartialFragmentDoc = gql`
    fragment listPartial on List {
  id
  title
}
    `;
export const UserListPartialFragmentDoc = gql`
    fragment userListPartial on UserToList {
  userId
  listId
  privileges
  mostCommonWords
  sortedItems
}
    `;
export const ItemHistoryFragmentFragmentDoc = gql`
    fragment itemHistoryFragment on ItemHistory {
  id
  item
  removalRating
}
    `;
export const UserListWithHistoryFragmentDoc = gql`
    fragment userListWithHistory on UserToList {
  userId
  listId
  privileges
  mostCommonWords
  sortedItems
  itemHistory {
    ...itemHistoryFragment
  }
}
    ${ItemHistoryFragmentFragmentDoc}`;
export const ItemFragmentFragmentDoc = gql`
    fragment itemFragment on Item {
  id
  name
  notes
  strike
}
    `;
export const FieldErrorFragmentDoc = gql`
    fragment fieldError on FieldError {
  field
  message
}
    `;
export const ItemResponseFragmentDoc = gql`
    fragment itemResponse on ItemResponse {
  item {
    ...itemFragment
  }
  errors {
    ...fieldError
  }
}
    ${ItemFragmentFragmentDoc}
${FieldErrorFragmentDoc}`;
export const ListFragmentFragmentDoc = gql`
    fragment listFragment on List {
  id
  title
  items {
    ...itemFragment
  }
}
    ${ItemFragmentFragmentDoc}`;
export const ListResponseFragmentDoc = gql`
    fragment listResponse on ListResponse {
  list {
    ...listFragment
  }
  errors {
    ...fieldError
  }
}
    ${ListFragmentFragmentDoc}
${FieldErrorFragmentDoc}`;
export const UserListFragmentFragmentDoc = gql`
    fragment userListFragment on UserToList {
  userId
  listId
  privileges
  mostCommonWords
  smartSortedItems
  sharedUsers {
    shared
    email
    privileges
  }
  sortedItems
  itemHistory {
    ...itemHistoryFragment
  }
  list {
    ...listFragment
  }
}
    ${ItemHistoryFragmentFragmentDoc}
${ListFragmentFragmentDoc}`;
export const UserListResponseFragmentDoc = gql`
    fragment userListResponse on UserToListResponse {
  userToList {
    ...userListFragment
  }
  errors {
    ...fieldError
  }
  notifications
}
    ${UserListFragmentFragmentDoc}
${FieldErrorFragmentDoc}`;
export const UserFragmentFragmentDoc = gql`
    fragment userFragment on User {
  id
  email
  sortedListsArray
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment userResponse on UserResponse {
  user {
    ...userFragment
  }
  errors {
    ...fieldError
  }
}
    ${UserFragmentFragmentDoc}
${FieldErrorFragmentDoc}`;
export const UserWithListResponseFragmentDoc = gql`
    fragment userWithListResponse on UserWithListResponse {
  user {
    ...userFragment
  }
  userToList {
    ...userListFragment
  }
  errors {
    ...fieldError
  }
}
    ${UserFragmentFragmentDoc}
${UserListFragmentFragmentDoc}
${FieldErrorFragmentDoc}`;
export const AddItemDocument = gql`
    mutation AddItem($data: AddItemInput!) {
  addItem(data: $data) {
    ...userListResponse
  }
}
    ${UserListResponseFragmentDoc}`;
export type AddItemMutationFn = Apollo.MutationFunction<AddItemMutation, AddItemMutationVariables>;

/**
 * __useAddItemMutation__
 *
 * To run a mutation, you first call `useAddItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addItemMutation, { data, loading, error }] = useAddItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddItemMutation(baseOptions?: Apollo.MutationHookOptions<AddItemMutation, AddItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddItemMutation, AddItemMutationVariables>(AddItemDocument, options);
      }
export type AddItemMutationHookResult = ReturnType<typeof useAddItemMutation>;
export type AddItemMutationResult = Apollo.MutationResult<AddItemMutation>;
export type AddItemMutationOptions = Apollo.BaseMutationOptions<AddItemMutation, AddItemMutationVariables>;
export const AddNoteDocument = gql`
    mutation AddNote($data: AddNoteInput!) {
  addNote(data: $data) {
    item {
      id
      notes
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type AddNoteMutationFn = Apollo.MutationFunction<AddNoteMutation, AddNoteMutationVariables>;

/**
 * __useAddNoteMutation__
 *
 * To run a mutation, you first call `useAddNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNoteMutation, { data, loading, error }] = useAddNoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddNoteMutation(baseOptions?: Apollo.MutationHookOptions<AddNoteMutation, AddNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNoteMutation, AddNoteMutationVariables>(AddNoteDocument, options);
      }
export type AddNoteMutationHookResult = ReturnType<typeof useAddNoteMutation>;
export type AddNoteMutationResult = Apollo.MutationResult<AddNoteMutation>;
export type AddNoteMutationOptions = Apollo.BaseMutationOptions<AddNoteMutation, AddNoteMutationVariables>;
export const DeleteItemsDocument = gql`
    mutation DeleteItems($data: DeleteItemsInput!) {
  deleteItems(data: $data) {
    userToList {
      listId
      sortedItems
      smartSortedItems
      list {
        id
        items {
          id
        }
      }
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type DeleteItemsMutationFn = Apollo.MutationFunction<DeleteItemsMutation, DeleteItemsMutationVariables>;

/**
 * __useDeleteItemsMutation__
 *
 * To run a mutation, you first call `useDeleteItemsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteItemsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteItemsMutation, { data, loading, error }] = useDeleteItemsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteItemsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteItemsMutation, DeleteItemsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteItemsMutation, DeleteItemsMutationVariables>(DeleteItemsDocument, options);
      }
export type DeleteItemsMutationHookResult = ReturnType<typeof useDeleteItemsMutation>;
export type DeleteItemsMutationResult = Apollo.MutationResult<DeleteItemsMutation>;
export type DeleteItemsMutationOptions = Apollo.BaseMutationOptions<DeleteItemsMutation, DeleteItemsMutationVariables>;
export const DeleteNoteDocument = gql`
    mutation DeleteNote($data: DeleteNoteInput!) {
  deleteNote(data: $data) {
    item {
      id
      notes
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type DeleteNoteMutationFn = Apollo.MutationFunction<DeleteNoteMutation, DeleteNoteMutationVariables>;

/**
 * __useDeleteNoteMutation__
 *
 * To run a mutation, you first call `useDeleteNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNoteMutation, { data, loading, error }] = useDeleteNoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteNoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNoteMutation, DeleteNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, options);
      }
export type DeleteNoteMutationHookResult = ReturnType<typeof useDeleteNoteMutation>;
export type DeleteNoteMutationResult = Apollo.MutationResult<DeleteNoteMutation>;
export type DeleteNoteMutationOptions = Apollo.BaseMutationOptions<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const EditItemNameDocument = gql`
    mutation EditItemName($data: EditItemNameInput!) {
  editItemName(data: $data) {
    ...userListResponse
  }
}
    ${UserListResponseFragmentDoc}`;
export type EditItemNameMutationFn = Apollo.MutationFunction<EditItemNameMutation, EditItemNameMutationVariables>;

/**
 * __useEditItemNameMutation__
 *
 * To run a mutation, you first call `useEditItemNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditItemNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editItemNameMutation, { data, loading, error }] = useEditItemNameMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useEditItemNameMutation(baseOptions?: Apollo.MutationHookOptions<EditItemNameMutation, EditItemNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditItemNameMutation, EditItemNameMutationVariables>(EditItemNameDocument, options);
      }
export type EditItemNameMutationHookResult = ReturnType<typeof useEditItemNameMutation>;
export type EditItemNameMutationResult = Apollo.MutationResult<EditItemNameMutation>;
export type EditItemNameMutationOptions = Apollo.BaseMutationOptions<EditItemNameMutation, EditItemNameMutationVariables>;
export const EditNoteDocument = gql`
    mutation EditNote($data: EditNoteInput!) {
  editNote(data: $data) {
    item {
      id
      notes
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type EditNoteMutationFn = Apollo.MutationFunction<EditNoteMutation, EditNoteMutationVariables>;

/**
 * __useEditNoteMutation__
 *
 * To run a mutation, you first call `useEditNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editNoteMutation, { data, loading, error }] = useEditNoteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useEditNoteMutation(baseOptions?: Apollo.MutationHookOptions<EditNoteMutation, EditNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditNoteMutation, EditNoteMutationVariables>(EditNoteDocument, options);
      }
export type EditNoteMutationHookResult = ReturnType<typeof useEditNoteMutation>;
export type EditNoteMutationResult = Apollo.MutationResult<EditNoteMutation>;
export type EditNoteMutationOptions = Apollo.BaseMutationOptions<EditNoteMutation, EditNoteMutationVariables>;
export const StrikeItemDocument = gql`
    mutation StrikeItem($data: StrikeItemInput!) {
  strikeItem(data: $data) {
    userToList {
      listId
      sortedItems
      smartSortedItems
      list {
        id
        items {
          id
          strike
        }
      }
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type StrikeItemMutationFn = Apollo.MutationFunction<StrikeItemMutation, StrikeItemMutationVariables>;

/**
 * __useStrikeItemMutation__
 *
 * To run a mutation, you first call `useStrikeItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStrikeItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [strikeItemMutation, { data, loading, error }] = useStrikeItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useStrikeItemMutation(baseOptions?: Apollo.MutationHookOptions<StrikeItemMutation, StrikeItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StrikeItemMutation, StrikeItemMutationVariables>(StrikeItemDocument, options);
      }
export type StrikeItemMutationHookResult = ReturnType<typeof useStrikeItemMutation>;
export type StrikeItemMutationResult = Apollo.MutationResult<StrikeItemMutation>;
export type StrikeItemMutationOptions = Apollo.BaseMutationOptions<StrikeItemMutation, StrikeItemMutationVariables>;
export const CreateListDocument = gql`
    mutation CreateList($title: String!) {
  createList(title: $title) {
    ...userWithListResponse
  }
}
    ${UserWithListResponseFragmentDoc}`;
export type CreateListMutationFn = Apollo.MutationFunction<CreateListMutation, CreateListMutationVariables>;

/**
 * __useCreateListMutation__
 *
 * To run a mutation, you first call `useCreateListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createListMutation, { data, loading, error }] = useCreateListMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateListMutation(baseOptions?: Apollo.MutationHookOptions<CreateListMutation, CreateListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateListMutation, CreateListMutationVariables>(CreateListDocument, options);
      }
export type CreateListMutationHookResult = ReturnType<typeof useCreateListMutation>;
export type CreateListMutationResult = Apollo.MutationResult<CreateListMutation>;
export type CreateListMutationOptions = Apollo.BaseMutationOptions<CreateListMutation, CreateListMutationVariables>;
export const DeleteListDocument = gql`
    mutation DeleteList($listId: String!) {
  deleteList(listId: $listId) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type DeleteListMutationFn = Apollo.MutationFunction<DeleteListMutation, DeleteListMutationVariables>;

/**
 * __useDeleteListMutation__
 *
 * To run a mutation, you first call `useDeleteListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteListMutation, { data, loading, error }] = useDeleteListMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useDeleteListMutation(baseOptions?: Apollo.MutationHookOptions<DeleteListMutation, DeleteListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteListMutation, DeleteListMutationVariables>(DeleteListDocument, options);
      }
export type DeleteListMutationHookResult = ReturnType<typeof useDeleteListMutation>;
export type DeleteListMutationResult = Apollo.MutationResult<DeleteListMutation>;
export type DeleteListMutationOptions = Apollo.BaseMutationOptions<DeleteListMutation, DeleteListMutationVariables>;
export const RenameListDocument = gql`
    mutation RenameList($name: String!, $listId: String!) {
  renameList(name: $name, listId: $listId) {
    list {
      id
      title
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type RenameListMutationFn = Apollo.MutationFunction<RenameListMutation, RenameListMutationVariables>;

/**
 * __useRenameListMutation__
 *
 * To run a mutation, you first call `useRenameListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameListMutation, { data, loading, error }] = useRenameListMutation({
 *   variables: {
 *      name: // value for 'name'
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useRenameListMutation(baseOptions?: Apollo.MutationHookOptions<RenameListMutation, RenameListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameListMutation, RenameListMutationVariables>(RenameListDocument, options);
      }
export type RenameListMutationHookResult = ReturnType<typeof useRenameListMutation>;
export type RenameListMutationResult = Apollo.MutationResult<RenameListMutation>;
export type RenameListMutationOptions = Apollo.BaseMutationOptions<RenameListMutation, RenameListMutationVariables>;
export const ShareListDocument = gql`
    mutation ShareList($data: ShareListInput!) {
  shareList(data: $data) {
    userToList {
      listId
      sharedUsers {
        shared
        email
        privileges
      }
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type ShareListMutationFn = Apollo.MutationFunction<ShareListMutation, ShareListMutationVariables>;

/**
 * __useShareListMutation__
 *
 * To run a mutation, you first call `useShareListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShareListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shareListMutation, { data, loading, error }] = useShareListMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useShareListMutation(baseOptions?: Apollo.MutationHookOptions<ShareListMutation, ShareListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShareListMutation, ShareListMutationVariables>(ShareListDocument, options);
      }
export type ShareListMutationHookResult = ReturnType<typeof useShareListMutation>;
export type ShareListMutationResult = Apollo.MutationResult<ShareListMutation>;
export type ShareListMutationOptions = Apollo.BaseMutationOptions<ShareListMutation, ShareListMutationVariables>;
export const SortItemsDocument = gql`
    mutation SortItems($data: StringArrayInput!, $listId: String!) {
  sortItems(data: $data, listId: $listId) {
    userToList {
      listId
      sortedItems
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type SortItemsMutationFn = Apollo.MutationFunction<SortItemsMutation, SortItemsMutationVariables>;

/**
 * __useSortItemsMutation__
 *
 * To run a mutation, you first call `useSortItemsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSortItemsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sortItemsMutation, { data, loading, error }] = useSortItemsMutation({
 *   variables: {
 *      data: // value for 'data'
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useSortItemsMutation(baseOptions?: Apollo.MutationHookOptions<SortItemsMutation, SortItemsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SortItemsMutation, SortItemsMutationVariables>(SortItemsDocument, options);
      }
export type SortItemsMutationHookResult = ReturnType<typeof useSortItemsMutation>;
export type SortItemsMutationResult = Apollo.MutationResult<SortItemsMutation>;
export type SortItemsMutationOptions = Apollo.BaseMutationOptions<SortItemsMutation, SortItemsMutationVariables>;
export const SortListsDocument = gql`
    mutation SortLists($data: StringArrayInput!) {
  sortLists(data: $data) {
    user {
      id
      sortedListsArray
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type SortListsMutationFn = Apollo.MutationFunction<SortListsMutation, SortListsMutationVariables>;

/**
 * __useSortListsMutation__
 *
 * To run a mutation, you first call `useSortListsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSortListsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sortListsMutation, { data, loading, error }] = useSortListsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSortListsMutation(baseOptions?: Apollo.MutationHookOptions<SortListsMutation, SortListsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SortListsMutation, SortListsMutationVariables>(SortListsDocument, options);
      }
export type SortListsMutationHookResult = ReturnType<typeof useSortListsMutation>;
export type SortListsMutationResult = Apollo.MutationResult<SortListsMutation>;
export type SortListsMutationOptions = Apollo.BaseMutationOptions<SortListsMutation, SortListsMutationVariables>;
export const SubmitPreferredOrderDocument = gql`
    mutation SubmitPreferredOrder($data: PreferredOrderInput!) {
  submitPreferredOrder(data: $data) {
    userToList {
      listId
      smartSortedItems
      itemHistory {
        id
        removalRating
      }
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type SubmitPreferredOrderMutationFn = Apollo.MutationFunction<SubmitPreferredOrderMutation, SubmitPreferredOrderMutationVariables>;

/**
 * __useSubmitPreferredOrderMutation__
 *
 * To run a mutation, you first call `useSubmitPreferredOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitPreferredOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitPreferredOrderMutation, { data, loading, error }] = useSubmitPreferredOrderMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSubmitPreferredOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitPreferredOrderMutation, SubmitPreferredOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitPreferredOrderMutation, SubmitPreferredOrderMutationVariables>(SubmitPreferredOrderDocument, options);
      }
export type SubmitPreferredOrderMutationHookResult = ReturnType<typeof useSubmitPreferredOrderMutation>;
export type SubmitPreferredOrderMutationResult = Apollo.MutationResult<SubmitPreferredOrderMutation>;
export type SubmitPreferredOrderMutationOptions = Apollo.BaseMutationOptions<SubmitPreferredOrderMutation, SubmitPreferredOrderMutationVariables>;
export const UpdatePrivilegesDocument = gql`
    mutation UpdatePrivileges($data: UpdatePrivilegesInput!) {
  updatePrivileges(data: $data) {
    userToList {
      listId
      sharedUsers {
        shared
        email
        privileges
      }
    }
    errors {
      ...fieldError
    }
  }
}
    ${FieldErrorFragmentDoc}`;
export type UpdatePrivilegesMutationFn = Apollo.MutationFunction<UpdatePrivilegesMutation, UpdatePrivilegesMutationVariables>;

/**
 * __useUpdatePrivilegesMutation__
 *
 * To run a mutation, you first call `useUpdatePrivilegesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePrivilegesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePrivilegesMutation, { data, loading, error }] = useUpdatePrivilegesMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdatePrivilegesMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePrivilegesMutation, UpdatePrivilegesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePrivilegesMutation, UpdatePrivilegesMutationVariables>(UpdatePrivilegesDocument, options);
      }
export type UpdatePrivilegesMutationHookResult = ReturnType<typeof useUpdatePrivilegesMutation>;
export type UpdatePrivilegesMutationResult = Apollo.MutationResult<UpdatePrivilegesMutation>;
export type UpdatePrivilegesMutationOptions = Apollo.BaseMutationOptions<UpdatePrivilegesMutation, UpdatePrivilegesMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  deleteAccount
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logout
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const GetUserDocument = gql`
    query GetUser {
  getUser {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersListsDocument = gql`
    query GetUsersLists {
  getUsersLists {
    ...userListResponse
  }
}
    ${UserListResponseFragmentDoc}`;

/**
 * __useGetUsersListsQuery__
 *
 * To run a query within a React component, call `useGetUsersListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersListsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersListsQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersListsQuery, GetUsersListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersListsQuery, GetUsersListsQueryVariables>(GetUsersListsDocument, options);
      }
export function useGetUsersListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersListsQuery, GetUsersListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersListsQuery, GetUsersListsQueryVariables>(GetUsersListsDocument, options);
        }
export type GetUsersListsQueryHookResult = ReturnType<typeof useGetUsersListsQuery>;
export type GetUsersListsLazyQueryHookResult = ReturnType<typeof useGetUsersListsLazyQuery>;
export type GetUsersListsQueryResult = Apollo.QueryResult<GetUsersListsQuery, GetUsersListsQueryVariables>;
export const UpdateListDocument = gql`
    subscription updateList($listIdArray: [ID!]!) {
  subscribeToListUpdates(listIdArray: $listIdArray) {
    ...userListResponse
  }
}
    ${UserListResponseFragmentDoc}`;

/**
 * __useUpdateListSubscription__
 *
 * To run a query within a React component, call `useUpdateListSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUpdateListSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdateListSubscription({
 *   variables: {
 *      listIdArray: // value for 'listIdArray'
 *   },
 * });
 */
export function useUpdateListSubscription(baseOptions: Apollo.SubscriptionHookOptions<UpdateListSubscription, UpdateListSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UpdateListSubscription, UpdateListSubscriptionVariables>(UpdateListDocument, options);
      }
export type UpdateListSubscriptionHookResult = ReturnType<typeof useUpdateListSubscription>;
export type UpdateListSubscriptionResult = Apollo.SubscriptionResult<UpdateListSubscription>;