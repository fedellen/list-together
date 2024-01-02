import { buildSchema } from 'type-graphql';
import { AddItemResolver } from '../resolvers/item/addItem';
import { DeleteItemsResolver } from '../resolvers/item/deleteItems';
import { StrikeItemResolver } from '../resolvers/item/strikeItem';
import { AddNoteResolver } from '../resolvers/item/addNote';
import { DeleteNoteResolver } from '../resolvers/item/deleteNote';
import { CreateListResolver } from '../resolvers/list/createList';
import { DeleteListResolver } from '../resolvers/list/deleteList';
import { GetUsersListsResolver } from '../resolvers/list/getUsersLists';
import { RenameListResolver } from '../resolvers/list/renameList';
import { ShareListResolver } from '../resolvers/list/shareList';
import { SortItemsResolver } from '../resolvers/list/sortItems';
import { SubmitPreferredOrderResolver } from '../resolvers/list/submitPreferredOrder';
import { SubscribeToListUpdatesResolver } from '../resolvers/list/subscribeToListUpdates';
import { UpdatePrivilegesResolver } from '../resolvers/list/updatePrivileges';
import { GetUserResolver } from '../resolvers/user/getUser';
import { LogoutResolver } from '../resolvers/user/logout';
import { SortListsResolver } from '../resolvers/user/sortLists';
import { DeleteAccountResolver } from '../resolvers/user/deleteAccount';
import { EditItemNameResolver } from '../resolvers/item/editItemName';
import { EditNoteResolver } from '../resolvers/item/editNote';

// Redis PubSub
import { pubSub } from './pubSub';
import { StrikeItemsResolver } from '../resolvers/item/strikeItems';

// // ApolloServer PubSub
// import { PubSub } from 'apollo-server-express';
// const pubSub = new PubSub();

export const createSchema = () =>
  buildSchema({
    resolvers: [
      GetUserResolver,
      LogoutResolver,
      SortListsResolver,
      CreateListResolver,
      DeleteListResolver,
      GetUsersListsResolver,
      RenameListResolver,
      ShareListResolver,
      SortItemsResolver,
      SubmitPreferredOrderResolver,
      SubscribeToListUpdatesResolver,
      UpdatePrivilegesResolver,
      AddItemResolver,
      DeleteItemsResolver,
      StrikeItemResolver,
      StrikeItemsResolver,
      AddNoteResolver,
      DeleteNoteResolver,
      DeleteAccountResolver,
      EditItemNameResolver,
      EditNoteResolver
    ],
    validate: false,
    pubSub
  });
