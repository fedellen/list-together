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
  username: Scalars['String'];
  email: Scalars['String'];
  sortedListsArray?: Maybe<Array<Scalars['String']>>;
};

export type UserToListResponse = {
  __typename?: 'UserToListResponse';
  errors?: Maybe<Array<FieldError>>;
  userToList?: Maybe<Array<UserToList>>;
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
  privileges: Array<Scalars['String']>;
  itemHistory?: Maybe<Array<ItemHistory>>;
  mostCommonWords?: Maybe<Array<Scalars['String']>>;
  sortedItems?: Maybe<Array<Scalars['String']>>;
  list: List;
};

export type ItemHistory = {
  __typename?: 'ItemHistory';
  item: Scalars['String'];
  removalRating?: Maybe<Scalars['Int']>;
};

export type List = {
  __typename?: 'List';
  id: Scalars['ID'];
  title: Scalars['String'];
  items?: Maybe<Array<Item>>;
};

export type Item = {
  __typename?: 'Item';
  name: Scalars['String'];
  notes?: Maybe<Array<Scalars['String']>>;
  strike: Scalars['Boolean'];
  bold: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addItem: UserToListResponse;
  deleteItems: BooleanResponse;
  styleItem: ItemResponse;
  addNote: ItemResponse;
  renameItem: ItemResponse;
  createUser: UserResponse;
  confirmUser: Scalars['Boolean'];
  login: UserResponse;
  forgotPassword: Scalars['Boolean'];
  changePassword?: Maybe<UserResponse>;
  logout: Scalars['Boolean'];
  createList: UserToListResponse;
  shareList: BooleanResponse;
  deleteList: BooleanResponse;
  renameList: ListResponse;
  sortLists: UserResponse;
  sortItems: UserToListResponse;
  submitRemovalOrder: UserToListResponse;
};


export type MutationAddItemArgs = {
  data: AddItemInput;
};


export type MutationDeleteItemsArgs = {
  data: DeleteItemsInput;
};


export type MutationStyleItemArgs = {
  data: StyleItemInput;
};


export type MutationAddNoteArgs = {
  data: AddNoteInput;
};


export type MutationRenameItemArgs = {
  data: RenameItemInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationConfirmUserArgs = {
  token: Scalars['String'];
};


export type MutationLoginArgs = {
  data: LoginUserInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationCreateListArgs = {
  title: Scalars['String'];
};


export type MutationShareListArgs = {
  data: ShareListInput;
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


export type MutationSubmitRemovalOrderArgs = {
  data: RemovalOrderInput;
};

export type AddItemInput = {
  listId: Scalars['String'];
  nameInput: Scalars['String'];
};

export type BooleanResponse = {
  __typename?: 'BooleanResponse';
  errors?: Maybe<Array<FieldError>>;
  boolean?: Maybe<Scalars['Boolean']>;
};

export type DeleteItemsInput = {
  itemNameArray: Array<Scalars['String']>;
  listId: Scalars['String'];
};

export type ItemResponse = {
  __typename?: 'ItemResponse';
  errors?: Maybe<Array<FieldError>>;
  item?: Maybe<Item>;
};

export type StyleItemInput = {
  listId: Scalars['String'];
  itemName: Scalars['String'];
  style: Scalars['String'];
  isStyled: Scalars['Boolean'];
};

export type AddNoteInput = {
  listId: Scalars['String'];
  itemName: Scalars['String'];
  note: Scalars['String'];
};

export type RenameItemInput = {
  newName: Scalars['String'];
  listId: Scalars['String'];
  itemName: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CreateUserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type ChangePasswordInput = {
  token: Scalars['String'];
  password: Scalars['String'];
};

export type ShareListInput = {
  listId: Scalars['String'];
  email: Scalars['String'];
  privileges: Array<Scalars['String']>;
};

export type ListResponse = {
  __typename?: 'ListResponse';
  errors?: Maybe<Array<FieldError>>;
  list?: Maybe<List>;
};

export type StringArrayInput = {
  stringArray: Array<Scalars['String']>;
};

export type RemovalOrderInput = {
  removedItemArray: Array<Scalars['String']>;
  listId: Scalars['String'];
};

export type FieldErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type ItemFragmentFragment = (
  { __typename?: 'Item' }
  & Pick<Item, 'name' | 'notes' | 'strike' | 'bold'>
);

export type ItemHistoryFragmentFragment = (
  { __typename?: 'ItemHistory' }
  & Pick<ItemHistory, 'item' | 'removalRating'>
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
  & Pick<User, 'id' | 'username' | 'email' | 'sortedListsArray'>
);

export type UserListFragmentFragment = (
  { __typename?: 'UserToList' }
  & Pick<UserToList, 'userId' | 'listId' | 'privileges' | 'mostCommonWords' | 'sortedItems'>
  & { itemHistory?: Maybe<Array<(
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
    & ItemResponseFragment
  ) }
);

export type DeleteItemsMutationVariables = Exact<{
  data: DeleteItemsInput;
}>;


export type DeleteItemsMutation = (
  { __typename?: 'Mutation' }
  & { deleteItems: (
    { __typename?: 'BooleanResponse' }
    & BooleanResponseFragment
  ) }
);

export type RenameItemMutationVariables = Exact<{
  data: RenameItemInput;
}>;


export type RenameItemMutation = (
  { __typename?: 'Mutation' }
  & { renameItem: (
    { __typename?: 'ItemResponse' }
    & ItemResponseFragment
  ) }
);

export type StyleItemMutationVariables = Exact<{
  data: StyleItemInput;
}>;


export type StyleItemMutation = (
  { __typename?: 'Mutation' }
  & { styleItem: (
    { __typename?: 'ItemResponse' }
    & ItemResponseFragment
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
    & ListResponseFragment
  ) }
);

export type ShareListMutationVariables = Exact<{
  data: ShareListInput;
}>;


export type ShareListMutation = (
  { __typename?: 'Mutation' }
  & { shareList: (
    { __typename?: 'BooleanResponse' }
    & BooleanResponseFragment
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
      & UserListPartialFragment
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
    & UserResponseFragment
  ) }
);

export type SubmitRemovalOrderMutationVariables = Exact<{
  data: RemovalOrderInput;
}>;


export type SubmitRemovalOrderMutation = (
  { __typename?: 'Mutation' }
  & { submitRemovalOrder: (
    { __typename?: 'UserToListResponse' }
    & { userToList?: Maybe<Array<(
      { __typename?: 'UserToList' }
      & UserListWithHistoryFragment
    )>>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & FieldErrorFragment
    )>> }
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  data: ChangePasswordInput;
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword?: Maybe<(
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  )> }
);

export type ConfirmUserMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'confirmUser'>
);

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginUserMutationVariables = Exact<{
  data: LoginUserInput;
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
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
  name
  notes
  strike
  bold
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
}
    ${UserListFragmentFragmentDoc}
${FieldErrorFragmentDoc}`;
export const UserFragmentFragmentDoc = gql`
    fragment userFragment on User {
  id
  username
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
    ...itemResponse
  }
}
    ${ItemResponseFragmentDoc}`;
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
    ...booleanResponse
  }
}
    ${BooleanResponseFragmentDoc}`;
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
export const RenameItemDocument = gql`
    mutation RenameItem($data: RenameItemInput!) {
  renameItem(data: $data) {
    ...itemResponse
  }
}
    ${ItemResponseFragmentDoc}`;
export type RenameItemMutationFn = Apollo.MutationFunction<RenameItemMutation, RenameItemMutationVariables>;

/**
 * __useRenameItemMutation__
 *
 * To run a mutation, you first call `useRenameItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameItemMutation, { data, loading, error }] = useRenameItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRenameItemMutation(baseOptions?: Apollo.MutationHookOptions<RenameItemMutation, RenameItemMutationVariables>) {
        return Apollo.useMutation<RenameItemMutation, RenameItemMutationVariables>(RenameItemDocument, baseOptions);
      }
export type RenameItemMutationHookResult = ReturnType<typeof useRenameItemMutation>;
export type RenameItemMutationResult = Apollo.MutationResult<RenameItemMutation>;
export type RenameItemMutationOptions = Apollo.BaseMutationOptions<RenameItemMutation, RenameItemMutationVariables>;
export const StyleItemDocument = gql`
    mutation StyleItem($data: StyleItemInput!) {
  styleItem(data: $data) {
    ...itemResponse
  }
}
    ${ItemResponseFragmentDoc}`;
export type StyleItemMutationFn = Apollo.MutationFunction<StyleItemMutation, StyleItemMutationVariables>;

/**
 * __useStyleItemMutation__
 *
 * To run a mutation, you first call `useStyleItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStyleItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [styleItemMutation, { data, loading, error }] = useStyleItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useStyleItemMutation(baseOptions?: Apollo.MutationHookOptions<StyleItemMutation, StyleItemMutationVariables>) {
        return Apollo.useMutation<StyleItemMutation, StyleItemMutationVariables>(StyleItemDocument, baseOptions);
      }
export type StyleItemMutationHookResult = ReturnType<typeof useStyleItemMutation>;
export type StyleItemMutationResult = Apollo.MutationResult<StyleItemMutation>;
export type StyleItemMutationOptions = Apollo.BaseMutationOptions<StyleItemMutation, StyleItemMutationVariables>;
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
    ...listResponse
  }
}
    ${ListResponseFragmentDoc}`;
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
    ...booleanResponse
  }
}
    ${BooleanResponseFragmentDoc}`;
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
      ...userListPartial
    }
    errors {
      ...fieldError
    }
  }
}
    ${UserListPartialFragmentDoc}
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
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
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
export const SubmitRemovalOrderDocument = gql`
    mutation SubmitRemovalOrder($data: RemovalOrderInput!) {
  submitRemovalOrder(data: $data) {
    userToList {
      ...userListWithHistory
    }
    errors {
      ...fieldError
    }
  }
}
    ${UserListWithHistoryFragmentDoc}
${FieldErrorFragmentDoc}`;
export type SubmitRemovalOrderMutationFn = Apollo.MutationFunction<SubmitRemovalOrderMutation, SubmitRemovalOrderMutationVariables>;

/**
 * __useSubmitRemovalOrderMutation__
 *
 * To run a mutation, you first call `useSubmitRemovalOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitRemovalOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitRemovalOrderMutation, { data, loading, error }] = useSubmitRemovalOrderMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSubmitRemovalOrderMutation(baseOptions?: Apollo.MutationHookOptions<SubmitRemovalOrderMutation, SubmitRemovalOrderMutationVariables>) {
        return Apollo.useMutation<SubmitRemovalOrderMutation, SubmitRemovalOrderMutationVariables>(SubmitRemovalOrderDocument, baseOptions);
      }
export type SubmitRemovalOrderMutationHookResult = ReturnType<typeof useSubmitRemovalOrderMutation>;
export type SubmitRemovalOrderMutationResult = Apollo.MutationResult<SubmitRemovalOrderMutation>;
export type SubmitRemovalOrderMutationOptions = Apollo.BaseMutationOptions<SubmitRemovalOrderMutation, SubmitRemovalOrderMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ConfirmUserDocument = gql`
    mutation ConfirmUser($token: String!) {
  confirmUser(token: $token)
}
    `;
export type ConfirmUserMutationFn = Apollo.MutationFunction<ConfirmUserMutation, ConfirmUserMutationVariables>;

/**
 * __useConfirmUserMutation__
 *
 * To run a mutation, you first call `useConfirmUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmUserMutation, { data, loading, error }] = useConfirmUserMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmUserMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmUserMutation, ConfirmUserMutationVariables>) {
        return Apollo.useMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(ConfirmUserDocument, baseOptions);
      }
export type ConfirmUserMutationHookResult = ReturnType<typeof useConfirmUserMutation>;
export type ConfirmUserMutationResult = Apollo.MutationResult<ConfirmUserMutation>;
export type ConfirmUserMutationOptions = Apollo.BaseMutationOptions<ConfirmUserMutation, ConfirmUserMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, baseOptions);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($data: LoginUserInput!) {
  login(data: $data) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, baseOptions);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
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