import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware
} from 'type-graphql';

import { logger } from '../middleware/logger';

import { MyContext } from '../MyContext';
import { validateContext } from './types/validators/validateContext';

import { ItemHistory, List, User, UserToList } from '../entities';

import { ShareListInput } from './types/input/ShareListInput';
import { StringArrayInput } from './types/input/StringArrayInput';
import { PreferredOrderInput } from './types/input/PreferredOrderInput';

import { UserToListResponse } from './types/response/UserToListResponse';
import { ListResponse } from './types/response/ListResponse';
import { BooleanResponse } from './types/response/BooleanResponse';
import { UserResponse } from './types/response/UserResponse';
import { SubscriptionPayload } from './types/subscription/SubscriptionPayload';
import { SubscriptionArgs } from './types/subscription/SubscriptionArgs';
import { Topic } from './types/subscription/SubscriptionTopics';
import { validateStringLength } from './types/validators/validateStringLength';
import { validateUserToList } from './types/validators/validateUserToList';
import { UpdatePrivilegesInput } from './types/input/UpdatePrivilegesInput';
import { validatePrivilegeType } from './types/validators/validatePrivilegeType';

@Resolver()
export class ListResolver {
  // @UseMiddleware(logger)
  @Subscription(() => UserToListResponse, {
    topics: 'updateList',
    filter: ({
      payload,
      args
    }: ResolverFilterData<SubscriptionPayload, SubscriptionArgs>) => {
      return args.listIdArray.includes(payload.updatedListId);
    }
  })
  async subscribeToListUpdates(
    @Root()
    {
      updatedListId,
      userIdToShare,
      userIdToExclude,
      notification
    }: SubscriptionPayload,
    // Frontend sends array of their ListIds to subscribe to
    @Args() {}: SubscriptionArgs,
    @Ctx() { connection }: MyContext
  ): Promise<UserToListResponse | null> {
    const userId: string = userIdToShare
      ? userIdToShare /** Newly shared list for the user */
      : connection.context.req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: 'context',
            message: 'Context contains no userId..'
          }
        ]
      };
    }

    /** Return user an undefined response instead of null to keep subscription alive */
    if (
      userIdToExclude === userId ||
      userIdToShare !== connection.context.req.session.userId
    )
      return { userToList: undefined };

    const usersList = await UserToList.findOne({
      where: {
        userId: userId,
        listId: updatedListId
      },
      relations: ['list', 'list.items', 'itemHistory']
    });
    if (!usersList) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'Could not find that list connection..'
          }
        ]
      };
    }

    return {
      userToList: [usersList],
      notifications: notification ? [notification] : []
    };
  }

  @UseMiddleware(logger)
  @Query(() => UserToListResponse)
  async getUsersLists(@Ctx() context: MyContext): Promise<UserToListResponse> {
    // Gets only the specified user's lists
    const errors = validateContext(context);
    if (errors) return { errors };

    const userToList = await UserToList.find({
      where: { userId: context.req.session.userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    if (!userToList) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'Could not find any lists for that userId..'
          }
        ]
      };
    }

    return { userToList };
  }

  // Create a list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async createList(
    @Arg('title') title: string,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const stringLengthErrors = validateStringLength(title);
    if (stringLengthErrors) return { errors: stringLengthErrors };

    const user = await User.findOne(context.req.session.userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'context',
            message: 'Context contains invalid user id..'
          }
        ]
      };
    }

    // Check to see if user already owns 25 lists
    const userToListTableArray = await UserToList.find({
      where: { userId: user.id }
    });
    const userToListTablesAsOwner = userToListTableArray.filter(
      (listConnection) => listConnection.privileges.includes('owner')
    );

    if (userToListTablesAsOwner.length >= 25) {
      return {
        errors: [
          {
            field: 'lists',
            message: 'User cannot create more than 25 lists..'
          }
        ]
      };
    }

    // Make the list 👌
    const list = await List.create({
      title
    }).save();
    const userToList = await UserToList.create({
      listId: list.id,
      userId: user.id,
      privileges: 'owner',
      list: list
    }).save();
    /** Add to front of user's sorted list array */
    if (user.sortedListsArray) {
      user.sortedListsArray = [list.id, ...user.sortedListsArray];
    } else {
      user.sortedListsArray = [list.id];
    }
    await user.save();

    return { userToList: [userToList] };
  }

  // Share a list
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async shareList(
    @Arg('data') data: ShareListInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const privilegeTypeError = validatePrivilegeType(data.privileges);
    if (privilegeTypeError) return { errors: privilegeTypeError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'owner'
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable)
      throw new Error('UserList validation error on `shareList`..');

    const userToShare = await User.findOne({ where: { email: data.email } });
    if (!userToShare) {
      return {
        errors: [
          {
            field: 'email',
            message: 'A user with that email address does not exist..'
          }
        ]
      };
    }

    const userAlreadyHasList = await UserToList.findOne({
      where: { listId: data.listId, userId: userToShare.id },
      relations: ['list']
    });

    if (userAlreadyHasList) {
      return {
        errors: [
          {
            field: 'email',
            message: 'That email already has a connection to that list..'
          }
        ]
      };
    }

    await UserToList.create({
      listId: data.listId,
      privileges: data.privileges,
      userId: userToShare.id
    }).save();

    const userToListTableWithUpdatedSharedUsers = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });
    if (!userToListTableWithUpdatedSharedUsers) {
      return {
        errors: [
          {
            field: 'updatedList',
            message:
              'An unexpected error has occurred while returning list with updated sharedUsers..'
          }
        ]
      };
    }

    return { userToList: [userToListTableWithUpdatedSharedUsers] };
  }

  // Update shared user's privileges
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async updatePrivileges(
    @Arg('data') data: UpdatePrivilegesInput,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable,
      validatePrivilege: 'owner'
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable)
      throw new Error('UserList validation error on `shareList`..');

    const userToUpdate = await User.findOne({ where: { email: data.email } });
    if (!userToUpdate) {
      return {
        errors: [
          {
            field: 'email',
            message: 'A user with that email address does not exist..'
          }
        ]
      };
    }

    const sharedUserToListTable = await UserToList.findOne({
      where: { listId: data.listId, userId: userToUpdate.id },
      relations: ['list']
    });
    if (!sharedUserToListTable) {
      return {
        errors: [
          {
            field: 'email',
            message:
              'A user with that email address does not have access to that list..'
          }
        ]
      };
    }

    if (!data.privileges) {
      /** If no privileges are specified, remove all access from sharedUser */
      await sharedUserToListTable.remove();
      await publish({
        updatedListId: sharedUserToListTable.listId,
        userIdToShare: sharedUserToListTable.userId,
        notification: `Your access to list: "${sharedUserToListTable.list.title}" has been removed`
      });
    } else {
      const privilegeTypeError = validatePrivilegeType(data.privileges);
      if (privilegeTypeError) return { errors: privilegeTypeError };

      sharedUserToListTable.privileges = data.privileges;
      await sharedUserToListTable.save();
      await publish({
        updatedListId: sharedUserToListTable?.listId,
        userIdToShare: sharedUserToListTable?.userId,
        notification: `Your privilege level for list: "${sharedUserToListTable.list.title}" has been changed to ${sharedUserToListTable.privileges}`
      });
    }
    const userToListTableWithUpdatedSharedUsers = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });
    if (!userToListTableWithUpdatedSharedUsers) {
      return {
        errors: [
          {
            field: 'updatedList',
            message:
              'An unexpected error has occurred while returning list with updated sharedUsers..'
          }
        ]
      };
    }

    return { userToList: [userToListTableWithUpdatedSharedUsers] };
  }

  @UseMiddleware(logger)
  @Mutation(() => BooleanResponse)
  async deleteList(
    @Arg('listId') listId: string,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<BooleanResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const user = await User.findOne(context.req.session.userId);

    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: context.req.session.userId }
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'A user with that ID could not be found..'
          }
        ]
      };
    } else if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    }

    if (user.sortedListsArray) {
      user.sortedListsArray = user.sortedListsArray.filter(
        (listId) => listId !== userToListTable.listId
      );
      await user.save();
    }
    await userToListTable.remove();

    const listInDatabase = await List.findOne(listId, {
      relations: ['userConnection']
    });

    if (listInDatabase) {
      if (listInDatabase.userConnection.length === 0) {
        // Remove list from the database if no User Connections exist
        await listInDatabase.remove();
      } else {
        const remainingUsersArray = listInDatabase.userConnection;
        const isOwnerExist = remainingUsersArray.filter((userToList) =>
          userToList.privileges.includes('owner')
        );

        if (isOwnerExist.length === 0) {
          // If no owner of list exists, give owner privileges to next user
          const newOwnerUserToListTable = await UserToList.findOne({
            where: { userId: remainingUsersArray[0].userId, listId: listId },
            relations: ['list']
          });
          newOwnerUserToListTable!.privileges = 'owner';
          await newOwnerUserToListTable!.save();
          /** Notify new list owner if they're online */
          await publish({
            updatedListId: listId,
            userIdToShare: newOwnerUserToListTable!.userId,
            notification: `You are now the owner of list: "${newOwnerUserToListTable?.list.title}"`
          });
        }
      }
    }

    return { boolean: true };
  }

  // Rename List
  @UseMiddleware(logger)
  @Mutation(() => ListResponse)
  async renameList(
    @Arg('name') name: string,
    @Arg('listId') listId: string,
    @Ctx() context: MyContext,
    @PubSub(Topic.updateList) publish: Publisher<SubscriptionPayload>
  ): Promise<ListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { userId: userId, listId: listId },
      relations: ['list']
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    } else if (!userToListTable.privileges.includes('owner')) {
      return {
        errors: [
          {
            field: 'userToList',
            message: 'User does not have rights to rename that list..'
          }
        ]
      };
    }

    userToListTable.list.title = name;
    await userToListTable.save();
    await publish({ updatedListId: listId });

    // Server saves and returns array
    return { list: userToListTable.list };
  }

  // Authenticated users can save the following arrays regardless of their accuracy
  // Accuracy/synchronization conflicts will be handled on the front-end
  // Sorted list/item arrays are never used in the back-end for any purpose
  // Only storage of user's preferences

  // Sorted Lists -- the order that the lists are displayed
  @UseMiddleware(logger)
  @Mutation(() => UserResponse)
  async sortLists(
    @Arg('data') sortedlistsInput: StringArrayInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    // Authorized user sends array of listIds
    const userId = context.req.session.userId;
    const user = await User.findOne(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'User does not exist..'
          }
        ]
      };
    }

    const sortedListsArray = sortedlistsInput.stringArray;
    user.sortedListsArray = sortedListsArray;

    await user.save();
    return { user };
  }

  // Re-order list -- save the user's order of the items on a list
  // User will also submit their `autoSortedList` through this mutation
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async sortItems(
    @Arg('data') sortedItemsInput: StringArrayInput,
    @Arg('listId') listId: string,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };
    // Authorized user sends array of item names, and the listId
    const userId = context.req.session.userId;
    const userToList = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });
    if (!userToList) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    }

    const sortedItemsArray = sortedItemsInput.stringArray;
    userToList.sortedItems = sortedItemsArray;

    await userToList.save();
    return { userToList: [userToList] };
  }

  // Submit preferred order of items for Smart-Sort feature
  // User sends sorted array of item names as their preferred order
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async submitPreferredOrder(
    @Arg('data') { removedItemArray, listId }: PreferredOrderInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['itemHistory']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable)
      throw new Error('UserList validation error on `submitPreferredOrder`..');

    const arrayLengthRating = Math.round(1000 / removedItemArray.length);

    removedItemArray.forEach((item) => {
      const newRemovalRating = Math.round(
        (removedItemArray.indexOf(item) + 0.5) * arrayLengthRating
      ).toString(); // Save number as a string in Postgres

      /**
       *  Add 10 ratings to array to override and previous ratings
       *  This will also allow for the preferred order to `decay`
       */
      let arrayWithTenRemovalRatings: string[] = [];
      for (let i = 0; i < 10; i++) {
        arrayWithTenRemovalRatings = [
          ...arrayWithTenRemovalRatings,
          newRemovalRating
        ];
      }

      if (!userToListTable.itemHistory) {
        // Initialize item history
        userToListTable.itemHistory = [
          ItemHistory.create({
            item: item,
            removalRatingArray: arrayWithTenRemovalRatings
          })
        ];
      } else {
        const itemInHistory = userToListTable.itemHistory.find(
          (i) => i.item === item
        );
        if (!itemInHistory) {
          // Add item to item history
          userToListTable.itemHistory = [
            ...userToListTable.itemHistory,
            ItemHistory.create({
              item: item,
              removalRatingArray: arrayWithTenRemovalRatings
            })
          ];
        } else {
          // Replace removalRating array with preferred rating
          itemInHistory.removalRatingArray = arrayWithTenRemovalRatings;
        }
      }
    });
    await userToListTable.save();
    return { userToList: [userToListTable] };
  }
}
