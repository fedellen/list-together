import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getUser?: Maybe<User>;
  getUsersLists: UserToListResponse;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  sortedListsArray?: Maybe<Array<Scalars['String']>>;
};

export type UserToListResponse = {
  __typename?: 'UserToListResponse';
  errors?: Maybe<Array<FieldError>>;
  userToList?: Maybe<Array<UserToList>>;
  notifications?: Maybe<Array<Scalars['String']>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserToList = {
  __typename?: 'UserToList';
  userId: Scalars['ID'];
  listId: Scalars['ID'];
  privileges: Scalars['String'];
  itemHistory?: Maybe<Array<ItemHistory>>;
  mostCommonWords?: Maybe<Array<Scalars['String']>>;
  sharedUsers: Array<SharedUsers>;
  sortedItems?: Maybe<Array<Scalars['String']>>;
  list: List;
};

export type ItemHistory = {
  __typename?: 'ItemHistory';
  id: Scalars['ID'];
  item: Scalars['String'];
  removalRating?: Maybe<Scalars['Int']>;
};

export type SharedUsers = {
  __typename?: 'SharedUsers';
  shared: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  privileges?: Maybe<Scalars['String']>;
};

export type List = {
  __typename?: 'List';
  id: Scalars['ID'];
  title: Scalars['String'];
  items?: Maybe<Array<Item>>;
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID'];
  name: Scalars['String'];
  notes?: Maybe<Array<Scalars['String']>>;
  strike: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addItem: UserToListResponse;
  strikeItem: UserToListResponse;
  addNote: ItemResponse;
  deleteNote: ItemResponse;
  logout: Scalars['Boolean'];
  createList: UserToListResponse;
  shareList: UserToListResponse;
  updatePrivileges: UserToListResponse;
  deleteList: BooleanResponse;
  renameList: ListResponse;
  sortLists: UserResponse;
  sortItems: UserToListResponse;
  submitPreferredOrder: UserToListResponse;
  deleteItems: UserToListResponse;
};


export type MutationAddItemArgs = {
  data: AddItemInput;
};


export type MutationStrikeItemArgs = {
  data: StrikeItemInput;
};


export type MutationAddNoteArgs = {
  data: AddNoteInput;
};


export type MutationDeleteNoteArgs = {
  data: DeleteNoteInput;
};


export type MutationCreateListArgs = {
  title: Scalars['String'];
};


export type MutationShareListArgs = {
  data: ShareListInput;
};


export type MutationUpdatePrivilegesArgs = {
  data: UpdatePrivilegesInput;
};


export type MutationDeleteListArgs = {
  listId: Scalars['String'];
};


export type MutationRenameListArgs = {
  listId: Scalars['String'];
  name: Scalars['String'];
};


export type MutationSortListsArgs = {
  data: StringArrayInput;
};


export type MutationSortItemsArgs = {
  listId: Scalars['String'];
  data: StringArrayInput;
};


export type MutationSubmitPreferredOrderArgs = {
  data: PreferredOrderInput;
};


export type MutationDeleteItemsArgs = {
  data: DeleteItemsInput;
};

export type AddItemInput = {
  listId: Scalars['String'];
  nameInput: Scalars['String'];
};

export type StrikeItemInput = {
  listId: Scalars['String'];
  itemName: Scalars['String'];
};

export type ItemResponse = {
  __typename?: 'ItemResponse';
  errors?: Maybe<Array<FieldError>>;
  item?: Maybe<Item>;
};

export type AddNoteInput = {
  listId: Scalars['String'];
  itemName: Scalars['String'];
  note: Scalars['String'];
};

export type DeleteNoteInput = {
  note: Scalars['String'];
  itemName: Scalars['String'];
  listId: Scalars['String'];
};

export type ShareListInput = {
  listId: Scalars['String'];
  email: Scalars['String'];
  privileges: Scalars['String'];
};

export type UpdatePrivilegesInput = {
  listId: Scalars['String'];
  email: Scalars['String'];
  privileges?: Maybe<Scalars['String']>;
};

export type BooleanResponse = {
  __typename?: 'BooleanResponse';
  errors?: Maybe<Array<FieldError>>;
  boolean?: Maybe<Scalars['Boolean']>;
};

export type ListResponse = {
  __typename?: 'ListResponse';
  errors?: Maybe<Array<FieldError>>;
  list?: Maybe<List>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type StringArrayInput = {
  stringArray: Array<Scalars['String']>;
};

export type PreferredOrderInput = {
  removedItemArray: Array<Scalars['String']>;
  listId: Scalars['String'];
};

export type DeleteItemsInput = {
  itemNameArray: Array<Scalars['String']>;
  listId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  subscribeToListUpdates: UserToListResponse;
};


export type SubscriptionSubscribeToListUpdatesArgs = {
  listIdArray: Array<Scalars['ID']>;
};

export type FieldErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type ItemFragmentFragment = (
  { __typename?: 'Item' }
  & Pick<Item, 'id' | 'name' | 'notes' | 'strike'>
);

export type ItemHistoryFragmentFragment = (
  { __typename?: 'ItemHistory' }
  & Pick<ItemHistory, 'id' | 'item' | 'removalRating'>
);

export type ListFragmentFragment = (
  { __typename?: 'List' }
  & Pick<List, 'id' | 'title'>
  & { items?: Maybe<Array<(
    { __typename?: 'Item' }
    & ItemFragmentFragment
  )>> }
);

export type ListPartialFragment = (
  { __typename?: 'List' }
  & Pick<List, 'id' | 'title'>
);

export type UserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'sortedListsArray'>
);

export type UserListFragmentFragment = (
  { __typename?: 'UserToList' }
  & Pick<UserToList, 'userId' | 'listId' | 'privileges' | 'mostCommonWords' | 'sortedItems'>
  & { sharedUsers: Array<(
    { __typename?: 'SharedUsers' }
    & Pick<SharedUsers, 'shared' | 'email' | 'privileges'>
  )>, itemHistory?: Maybe<Array<(
    { __typename?: 'ItemHistory' }
    & ItemHistoryFragmentFragment
  )>>, list: (
    { __typename?: 'List' }
    & ListFragmentFragment
  ) }
);

export type UserListPartialFragment = (
  { __typename?: 'UserToList' }
  & Pick<UserToList, 'userId' | 'listId' | 'privileges' | 'mostCommonWords' | 'sortedItems'>
);

export type UserListWithHistoryFragment = (
  { __typename?: 'UserToList' }
  & Pick<UserToList, 'userId' | 'listId' | 'privileges' | 'mostCommonWords' | 'sortedItems'>
  & { itemHistory?: Maybe<Array<(
    { __typename?: 'ItemHistory' }
    & ItemHistoryFragmentFragment
  )>> }
);

export type AddItemMutationVariables = Exact<{
  data: AddItemInput;
}>;


export type AddItemMutation = (
  { __typename?: 'Mutation' }
  & { addItem: (
    { __typename?: 'UserToListResponse' }
    & UserListResponseFragment
  ) }
);

export type AddNoteMutationVariables = Exact<{
  data: AddNoteInput;
}>;


export type AddNoteMutation = (
  { __typename?: 'Mutation' }
  & { addNote: (
    { __typename?: 'ItemResponse' }
    & { item?: Maybe<(
      { __typename?: 'Item' }
      & Pick<Item, 'id' | 'notes'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type DeleteItemsMutationVariables = Exact<{
  data: DeleteItemsInput;
}>;


export type DeleteItemsMutation = (
  { __typename?: 'Mutation' }
  & { deleteItems: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & Pick<UserToList, 'listId' | 'sortedItems'>
      & { list: (
        { __typename?: 'List' }
        & Pick<List, 'id'>
        & { items?: Maybe<Array<(
          { __typename?: 'Item' }
          & Pick<Item, 'id'>
        )>> }
      ) }
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type DeleteNoteMutationVariables = Exact<{
  data: DeleteNoteInput;
}>;


export type DeleteNoteMutation = (
  { __typename?: 'Mutation' }
  & { deleteNote: (
    { __typename?: 'ItemResponse' }
    & { item?: Maybe<(
      { __typename?: 'Item' }
      & Pick<Item, 'id' | 'notes'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type StrikeItemMutationVariables = Exact<{
  data: StrikeItemInput;
}>;


export type StrikeItemMutation = (
  { __typename?: 'Mutation' }
  & { strikeItem: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & Pick<UserToList, 'listId' | 'sortedItems'>
      & { list: (
        { __typename?: 'List' }
        & Pick<List, 'id'>
        & { items?: Maybe<Array<(
          { __typename?: 'Item' }
          & Pick<Item, 'id' | 'strike'>
        )>> }
      ) }
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type CreateListMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateListMutation = (
  { __typename?: 'Mutation' }
  & { createList: (
    { __typename?: 'UserToListResponse' }
    & UserListResponseFragment
  ) }
);

export type DeleteListMutationVariables = Exact<{
  listId: Scalars['String'];
}>;


export type DeleteListMutation = (
  { __typename?: 'Mutation' }
  & { deleteList: (
    { __typename?: 'BooleanResponse' }
    & BooleanResponseFragment
  ) }
);

export type RenameListMutationVariables = Exact<{
  name: Scalars['String'];
  listId: Scalars['String'];
}>;


export type RenameListMutation = (
  { __typename?: 'Mutation' }
  & { renameList: (
    { __typename?: 'ListResponse' }
    & { list?: Maybe<(
      { __typename?: 'List' }
      & Pick<List, 'id' | 'title'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type ShareListMutationVariables = Exact<{
  data: ShareListInput;
}>;


export type ShareListMutation = (
  { __typename?: 'Mutation' }
  & { shareList: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & Pick<UserToList, 'listId'>
      & { sharedUsers: Array<(
        { __typename?: 'SharedUsers' }
        & Pick<SharedUsers, 'shared' | 'email' | 'privileges'>
      )> }
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type SortItemsMutationVariables = Exact<{
  data: StringArrayInput;
  listId: Scalars['String'];
}>;


export type SortItemsMutation = (
  { __typename?: 'Mutation' }
  & { sortItems: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & Pick<UserToList, 'listId' | 'sortedItems'>
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type SortListsMutationVariables = Exact<{
  data: StringArrayInput;
}>;


export type SortListsMutation = (
  { __typename?: 'Mutation' }
  & { sortLists: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'sortedListsArray'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type SubmitPreferredOrderMutationVariables = Exact<{
  data: PreferredOrderInput;
}>;


export type SubmitPreferredOrderMutation = (
  { __typename?: 'Mutation' }
  & { submitPreferredOrder: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & Pick<UserToList, 'listId'>
      & { itemHistory?: Maybe<Array<(
        { __typename?: 'ItemHistory' }
        & Pick<ItemHistory, 'id' | 'removalRating'>
      )>> }
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type UpdatePrivilegesMutationVariables = Exact<{
  data: UpdatePrivilegesInput;
}>;


export type UpdatePrivilegesMutation = (
  { __typename?: 'Mutation' }
  & { updatePrivileges: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & Pick<UserToList, 'listId'>
      & { sharedUsers: Array<(
        { __typename?: 'SharedUsers' }
        & Pick<SharedUsers, 'shared' | 'email' | 'privileges'>
      )> }
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type GetUsersListsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersListsQuery = (
  { __typename?: 'Query' }
  & { getUsersLists: (
    { __typename?: 'UserToListResponse' }
    & UserListResponseFragment
  ) }
);

export type BooleanResponseFragment = (
  { __typename?: 'BooleanResponse' }
  & Pick<BooleanResponse, 'boolean'>
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & FieldErrorFragment
  )>> }
);

export type ItemResponseFragment = (
  { __typename?: 'ItemResponse' }
  & { item?: Maybe<(
    { __typename?: 'Item' }
    & ItemFragmentFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & FieldErrorFragment
  )>> }
);

export type ListResponseFragment = (
  { __typename?: 'ListResponse' }
  & { list?: Maybe<(
    { __typename?: 'List' }
    & ListFragmentFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & FieldErrorFragment
  )>> }
);

export type UserListResponseFragment = (
  { __typename?: 'UserToListResponse' }
  & Pick<UserToListResponse, 'notifications'>
  & { userToList?: Maybe<Array<(
    { __typename?: 'UserToList' }
    & UserListFragmentFragment
  )>>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & FieldErrorFragment
  )>> }
);

export type UserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & FieldErrorFragment
  )>> }
);

export type UpdateListSubscriptionVariables = Exact<{
  listIdArray: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type UpdateListSubscription = (
  { __typename?: 'Subscription' }
  & { subscribeToListUpdates: (
    { __typename?: 'UserToListResponse' }
    & UserListResponseFragment
  ) }
);

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
export const FieldErrorFragmentDoc = gql`
    fragment fieldError on FieldError {
  field
  message
}
    `;
export const BooleanResponseFragmentDoc = gql`
    fragment booleanResponse on BooleanResponse {
  boolean
  errors {
    ...fieldError
  }
}
    ${FieldErrorFragmentDoc}`;
export const ItemFragmentFragmentDoc = gql`
    fragment itemFragment on Item {
  id
  name
  notes
  strike
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
        return Apollo.useMutation<AddItemMutation, AddItemMutationVariables>(AddItemDocument, baseOptions);
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
        return Apollo.useMutation<AddNoteMutation, AddNoteMutationVariables>(AddNoteDocument, baseOptions);
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
        return Apollo.useMutation<DeleteItemsMutation, DeleteItemsMutationVariables>(DeleteItemsDocument, baseOptions);
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
        return Apollo.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, baseOptions);
      }
export type DeleteNoteMutationHookResult = ReturnType<typeof useDeleteNoteMutation>;
export type DeleteNoteMutationResult = Apollo.MutationResult<DeleteNoteMutation>;
export type DeleteNoteMutationOptions = Apollo.BaseMutationOptions<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const StrikeItemDocument = gql`
    mutation StrikeItem($data: StrikeItemInput!) {
  strikeItem(data: $data) {
    userToList {
      listId
      sortedItems
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
        return Apollo.useMutation<StrikeItemMutation, StrikeItemMutationVariables>(StrikeItemDocument, baseOptions);
      }
export type StrikeItemMutationHookResult = ReturnType<typeof useStrikeItemMutation>;
export type StrikeItemMutationResult = Apollo.MutationResult<StrikeItemMutation>;
export type StrikeItemMutationOptions = Apollo.BaseMutationOptions<StrikeItemMutation, StrikeItemMutationVariables>;
export const CreateListDocument = gql`
    mutation CreateList($title: String!) {
  createList(title: $title) {
    ...userListResponse
  }
}
    ${UserListResponseFragmentDoc}`;
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
        return Apollo.useMutation<CreateListMutation, CreateListMutationVariables>(CreateListDocument, baseOptions);
      }
export type CreateListMutationHookResult = ReturnType<typeof useCreateListMutation>;
export type CreateListMutationResult = Apollo.MutationResult<CreateListMutation>;
export type CreateListMutationOptions = Apollo.BaseMutationOptions<CreateListMutation, CreateListMutationVariables>;
export const DeleteListDocument = gql`
    mutation DeleteList($listId: String!) {
  deleteList(listId: $listId) {
    ...booleanResponse
  }
}
    ${BooleanResponseFragmentDoc}`;
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
        return Apollo.useMutation<DeleteListMutation, DeleteListMutationVariables>(DeleteListDocument, baseOptions);
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
        return Apollo.useMutation<RenameListMutation, RenameListMutationVariables>(RenameListDocument, baseOptions);
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
        return Apollo.useMutation<ShareListMutation, ShareListMutationVariables>(ShareListDocument, baseOptions);
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
        return Apollo.useMutation<SortItemsMutation, SortItemsMutationVariables>(SortItemsDocument, baseOptions);
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
        return Apollo.useMutation<SortListsMutation, SortListsMutationVariables>(SortListsDocument, baseOptions);
      }
export type SortListsMutationHookResult = ReturnType<typeof useSortListsMutation>;
export type SortListsMutationResult = Apollo.MutationResult<SortListsMutation>;
export type SortListsMutationOptions = Apollo.BaseMutationOptions<SortListsMutation, SortListsMutationVariables>;
export const SubmitPreferredOrderDocument = gql`
    mutation SubmitPreferredOrder($data: PreferredOrderInput!) {
  submitPreferredOrder(data: $data) {
    userToList {
      listId
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
        return Apollo.useMutation<SubmitPreferredOrderMutation, SubmitPreferredOrderMutationVariables>(SubmitPreferredOrderDocument, baseOptions);
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
        return Apollo.useMutation<UpdatePrivilegesMutation, UpdatePrivilegesMutationVariables>(UpdatePrivilegesDocument, baseOptions);
      }
export type UpdatePrivilegesMutationHookResult = ReturnType<typeof useUpdatePrivilegesMutation>;
export type UpdatePrivilegesMutationResult = Apollo.MutationResult<UpdatePrivilegesMutation>;
export type UpdatePrivilegesMutationOptions = Apollo.BaseMutationOptions<UpdatePrivilegesMutation, UpdatePrivilegesMutationVariables>;
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
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, baseOptions);
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
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
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
        return Apollo.useQuery<GetUsersListsQuery, GetUsersListsQueryVariables>(GetUsersListsDocument, baseOptions);
      }
export function useGetUsersListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersListsQuery, GetUsersListsQueryVariables>) {
          return Apollo.useLazyQuery<GetUsersListsQuery, GetUsersListsQueryVariables>(GetUsersListsDocument, baseOptions);
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
        return Apollo.useSubscription<UpdateListSubscription, UpdateListSubscriptionVariables>(UpdateListDocument, baseOptions);
      }
export type UpdateListSubscriptionHookResult = ReturnType<typeof useUpdateListSubscription>;
export type UpdateListSubscriptionResult = Apollo.SubscriptionResult<UpdateListSubscription>;